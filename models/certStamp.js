class CertStamp {
    constructor(uesrDID, userSign, userInfo, subject){
        this.use = {
            did: uesrDID,
            signature: userSign,
            info: userInfo
        }
        this.updatedTime = Date.now()
        this.subject = subject
    }
}


module.exports = CertStamp;
