
const LDAP = require('../lib/ldap.client');
const ldapClient = new LDAP();
const CertStamp = require('../models/certStamp');


const registerUser = (req, res) =>{
    const addEvent = ldapClient.addUserInfo(
        req.body.auth.did.toLowerCase(),
        req.body.info
    );

    addEvent.on('new', async(err)=>{
        if (err != null) {
            res.status(409).json({
                error: err,
            });
            return;
        }

        const certStamp = new CertStamp(
            req.body.auth.did,
            req.body.auth.signature,
            req.body.info
        )
        const adminSign = await didClient.sign(
            JSON.stringify(certStamp), 
            'EcdsaSecp256k1RecoveryMethod2020', 
            didCfg.PRIVATE_KEY).signature; //@fix-add
        res.status(202).json({
            certStamp: certStamp,
            signature: adminSign
        });
    })
}

const updateUser = (req, res) => {

}

const externalTXN = (req,res)=>{
    // console.log('store external_txn');
    // console.log(req.query)
}

const provideInfo = (req, res) =>{
//     // 1. did auth, attrs
//     const auth = req.body.auth;
//     const attrs = req.body.attrs;
//     console.log(auth)
//     console.log(attrs)
//     //2. did auth (user)
//     if(auth.did == null || auth.pubKeyID == null || auth.signature == null)
//         res.send('Rejected: auth object is invalid');

//     const authResults = await didClient.didAuth(
//         auth.did.toLowerCase(),
//         auth.pubKeyID,
//         auth.signature,
//         JSON.stringify(attrs)
//     )
//     if(authResults[0] != true)
//         res.send('Invalid did auth..');


//     const event = ldapClient.readUserInfo(auth.did.toLowerCase(), attrs);
//     event.on('readUserInfo', (userInfo)=>{
//         const user = userInfo[0];
//         res.send(user)
//     });
}


module.exports = {
    registerUser,
    updateUser,
    externalTXN,
    provideInfo
}