/**
 * check user did auth:
*/

function extractAuth(req){
    let auth = null 
    if(req.query != null){
        auth = {
            did: req.query.did,
            pubKeyID: req.query.pubKeyID,
            signature: req.headers.authorization.replace('Bearer ','')
        }
    }else{
        auth = req.body.auth
    }
    return auth
}


module.exports = async function checkAuth(req,res,next){
    //**Because of test, pass auth process**//

    // const auth = extractAuth(req)
    // if(auth.did == null||
    //     auth.pubKeyID == null ||
    //     auth.signature == null
    // ){
    //     res.status.send({
    //         error: 'rejected: auth object is invalid!'
    //     });
    // }
    // const results = await didClient.didAuth(
    //     auth.did.toLowerCase(),
    //     auth.pubKeyID,
    //     auth.signature,
    //     JSON.stringify(info)
    // )
    // if(results[0] != true){
    //     res.status.send({
    //         error: 'Failed auth'
    //     });
    // }
    
    next()
}


