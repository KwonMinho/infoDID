const cors = require('cors');
const express = require('express');
const userRouter = require('./routes/users.routes');
const adminRouter = require('./routes/admin.routes');

const cfg = require('./config/did.cfg');
const DIDClient = require('./lib/did.eth.auth');


const app = express();


app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use('/users', userRouter);
app.use('/admin',adminRouter);

const didClient = new DIDClient({
    network: cfg.NETWORK,
    regABI: cfg.REG_ABI,
    account: cfg.ACCOUNT,
    password: cfg.PASSWORD
});

global.didClient = didClient;
global.didCfg = cfg;

app.listen(7788, ()=>{
    console.log('InfoDID service started on port 7788');
})
