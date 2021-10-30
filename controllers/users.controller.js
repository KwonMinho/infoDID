
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
            didCfg.PRIVATE_KEY).signature;
        res.status(202).json({
            certStamp: certStamp,
            signature: adminSign
        });
    })
}


const notifyBlockchain = (req,res)=>{
    // console.log('store external_txn');
    // console.log(req.query)
}

/**
 * body {
 *  auth,
 *  attrs
 * }
*/
const getUser = (req, res) =>{
    const readEvent = ldapClient.readUserInfo(
        req.query.did.toLowerCase(), 
        req.query.attrs
    );

    readEvent.on('read', (userInfo)=>{
        const user = userInfo[0];
        if(user == undefined){
            res.send("can't search...!");
            return;
        }
        res.send(user)
    });
}


module.exports = {
    registerUser,
    getUser
}