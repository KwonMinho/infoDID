/**
 * check user did auth
*/
const cfg = require('../config/did.cfg');
const DIDClient = require('../lib/did.eth.auth');
const didClient = new DIDClient({
    network: cfg.NETWORK,
    regABI: cfg.REG_ABI,
    account: cfg.ACCOUNT,
    password: cfg.PASSWORD
});


module.exports = async function checkAuth(req,res){
    if(req.body.auth.did == null||
        req.body.auth.pubKeyID == null ||
        req.body.auth.signature == null
    ){
        res.status.send({
            error: 'rejected: auth object is invalid!'
        });
    }

    const results = await didClient.didAuth(
        auth.did.toLowerCase(),
        auth.pubKeyID,
        auth.signature,
        JSON.stringify(info)
    )
    if(results[0] != true){
        res.status.send({
            error: 'Failed auth'
        });
    }
}