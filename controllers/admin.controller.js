
const LDAP = require('../lib/ldap.client');
const ldapClient = new LDAP();


const getAllUser = (req, res)=>{
    const allEvent = ldapClient.readUserList();
    allEvent.on('allRead',(users)=>{
        res.send({
            'list': users,
            'size': users.length,
        })
    })
}

module.exports = {
    getAllUser
}