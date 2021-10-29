const LdapClient = require(`${process.cwd()}/lib/ldap_client`);
const ldapClient = new LdapClient();

const cors = require('cors')
const didCfg = require(`${process.cwd()}/res/did.cfg.js`);

const EthDidClient = require(`${process.cwd()}/lib/eth-did-auth/index.js`);
const didClient = new EthDidClient({
    network: didCfg.NETWORK,
    regABI: didCfg.REG_ABI,
    account: didCfg.ACCOUNT,
    password: didCfg.PASSWORD
});



const curUserList = new Map();
const app = require('express');
app.use(cors())

//-- MAIN --/
app.replicateReq('POST','/user/info', async (req, res)=>{
    const type = req.body.type;
    const auth = req.body.auth;
    const info = req.body.info;

    //1. form check
    const formErr = ldapClient.checkForm(type, info);
    if(formErr != '') {
        res.send(formErr);
        return;
    }

    //2. did auth (user)
    console.log(auth)
    if(auth.did == null || auth.pubKeyID == null || auth.signature == null){
        res.send('Rejected: auth object is invalid');
        return;
    }

    const authResults = await didClient.didAuth(
        auth.did.toLowerCase(),
        auth.pubKeyID,
        auth.signature,
        JSON.stringify(info)
    )
    if(authResults[0] != true){
        res.send('Invalid did auth..');
        return;
    }

    //3. store info obj in ldap local
    let event;
    if(type == 'new') event = ldapClient.addUserInfo(auth.did.toLowerCase(), info);
    else if(type == 'update')  event = ldapClient.modifyUserInfo(auth.did.toLowerCase(), info)

    event.on(type, async (errMsg)=>{
        if(errMsg != null) {
            res.send(errMsg);
            return;
        }
        
        //4. make signature ()
        const certStamp = {
            user: {
                did: auth.did,
                signature: auth.signature,
                info: info
            },
            subject: didCfg.DID,
            updatedTime: Date.now(),
        }
        const signObj = await didClient.sign(JSON.stringify(certStamp), 'EcdsaSecp256k1RecoveryMethod2020', didCfg.PRIVATE_KEY);

        //5.send (end)
        const successResObj ={
            certStamp: certStamp,
            signature: signObj.signature
        }
        res.send(successResObj);
    });
}).rollback((req)=>{
    console.log('rollback')
    console.log(req.body);
})


app.req('POST','/service/info',async (req,res)=>{    
    // 1. did auth, attrs
    const auth = req.body.auth;
    const attrs = req.body.attrs;
    console.log(auth)
    console.log(attrs)
    //2. did auth (user)
    if(auth.did == null || auth.pubKeyID == null || auth.signature == null)
        res.send('Rejected: auth object is invalid');

    const authResults = await didClient.didAuth(
        auth.did.toLowerCase(),
        auth.pubKeyID,
        auth.signature,
        JSON.stringify(attrs)
    )
    if(authResults[0] != true)
        res.send('Invalid did auth..');


    const event = ldapClient.readUserInfo(auth.did.toLowerCase(), attrs);
    event.on('readUserInfo', (userInfo)=>{
        const user = userInfo[0];
        res.send(user)
    });
})


app.req('GET','/external_txn', (req, res)=>{
    console.log('store external_txn');
    console.log(req.query)
})



//-- Start Point --//
app.listen(9876, async ()=>{
    console.log('Init...');
    console.log('Read all user list in ldap');
    // const event = ldapClient.readUserList();
    // event.on('readUserList', (dnList)=>{
    //     const dnLen = dnList.length;    
    //     for(let i=0; i<dnLen; i++){
    //         const dnObj = dnList[i];
    //         const isException = (
    //             dnObj.dn == ldapCfg.ROOT_DN 
    //             || dnObj.dn == ldapCfg.ADMIN_DN
    //         )
    
    //         if(isException) continue;
    //         curUserList.set(dnObj.did, dnObj);
    //     }
    //     console.log('Success Read!');
    // });
    await didClient.init();

    console.log('user-info replication has started on port 9876');
})

