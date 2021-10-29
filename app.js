const cors = require('cors');
const express = require('express');

const userRouter = require('./routes/users.routes');


const app = express();


app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use('/users', userRouter);


/**
 * handling error
 */
app.use((req, res, next)=>{
    res.status(err.status || 404).json({
        message: 'No such route exists'
    })
})


app.use((err, req, res, next)=>{
    res.status(err.status || 500).json({
        message: 'Error Message'
    })
})


app.listen(7788, async ()=>{
    console.log('InfoDID service started on port 7788');
})




    // console.log('Init...');
    // console.log('Read all user list in ldap');
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
    // await didClient.init();

