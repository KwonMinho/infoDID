const ldap = require('ldapjs');
const cfg = require(`${process.cwd()}/res/ldap.cfg`);
const EventEmitter = require('events');


const applyAttrs = [
    'cn', 'sn', 'desc', 'privilege', 'didAddress', 'didPhoneNumber',
    'didEmail', 'didJob', 'didCountry', 'didBirth', 'didGender'
]

module.exports = class LDAPClient{

    constructor() {
        this.client = ldap.createClient({
            url: cfg.URL
        });
        this.client.bind(cfg.ADMIN_DN, cfg.PASSWORD, (err)=>{});
        this.checkAttrList = new Map(); 

        applyAttrs.forEach((attr)=>{
            this.checkAttrList.set(attr,true);
        });
    }

    checkForm(type, info){
        if(type == 'new'){
            return this._checkAddInfo(info);
        }else if(type == 'update'){
            return this._checkUpdateInfo(info);
        }
    }


    _checkUpdateInfo(i){
        let errMsg = '';
        if(i.add == null && i.replace == null && i.delete == null)
            errMsg += "Set one of the 'add', 'replace', or 'delete' attributes on info object. \n";
        
        if(i.add != null)
            errMsg += this._checkAttrs(i.add);

        if(i.replace != null)
            errMsg += this._checkAttrs(i.replace);

        if(i.delete != null)
            errMsg += this._checkAttrs(i.delete);
        return errMsg;
    }

    _checkAttrs(i){

        let errMsg = '';
        const senderAttrList = Object.keys(i);
        for(let id=0; id<senderAttrList.length; id++){
             const attr  = senderAttrList[id];
             if(this.checkAttrList.get(attr) != true){
                 errMsg += `${attr} is not apply attribute\n`
             }
        }
        return errMsg;
    }


    _checkAddInfo(i){
       let errMsg = '';

       if(i.cn == null || i.cn == undefined) errMsg += "Must be 'cn' attribute in InfoObject! \n";
       if(i.sn == null || i.sn == undefined) errMsg += "Must be 'sn' attribute in InfoObject! \n";
       if(i.didGender == null || i.didGender == undefined) errMsg += "Must be 'didGender' attribute in InfoObject! \n";
       if(i.didBirth == null || i.didBirth == undefined) errMsg += "Must be 'didBirth' attribute in InfoObject! \n";
       if(i.didCountry == null || i.didCountry == undefined) errMsg += "Must be 'didCountry' attribute in InfoObject! \n";

       errMsg += this._checkAttrs(i);
       return errMsg;
    }


    /**
     * @param {*} did 
     * @param {*} info 
     */
    addUserInfo(did, info){
        info['objectclass'] = [
            'top',
            'didObject',
            'person',
            'privacyInfo'
        ];
        
        info['createdTime'] = new Date();
        info['isPaused'] = 'FALSE';

        const event = new EventEmitter();
        this.client.add(`did=${did},${cfg.ROOT_DN}`, info, function(err){
            if(err != null){
                console.log(err);
                event.emit('new', err);
            }
            else event.emit('new', null);
        });
        return event
    }

    /**
     * did
     * attrs: arrary
     */
    readUserInfo(did, attrs){
        const event = new EventEmitter();
        const results = new Array();
        const opts ={
            scope: 'sub',
            filter: `(did=${did})`,
            attributes: attrs
        };

        this.client.search(cfg.ROOT_DN, opts, (err, res)=>{
            res.on('searchEntry', function(entry) {
                results.push(entry.object)
            });
            res.on('end', function() {
                event.emit('readUserInfo', results);
            });
        });

        return event;
    }


    /**
     * 
     */
    readUserList(){
        const event = new EventEmitter();
        const results = new Array();
        const opts ={
            scope: 'sub',
            filter: '(objectclass=*)',
            attributes: []
        };
        this.client.search(cfg.ROOT_DN, opts, (err, res)=>{
            res.on('searchEntry', function(entry) {
                results.push(entry.object)
            });
            res.on('end', function() {
                event.emit('readUserList', results);
            });
        })

        return event;
    }

    /* 
        'replcae', 'add', 'delete' 
    */
    //info { add: {m:v, m:c}, replace: {}, delete }
    modifyUserInfo(did, info){
        const event = new EventEmitter();
        let changes = [];

        if(info.add != null) 
            changes.push(this._makeChage('add', info.add));
        if(info.replace != null) 
            changes.push(this._makeChage('replace', info.replace));
        if(info.delete != null) 
            changes.push(this._makeChage('delete', info.delete));        
        
        this.client.modify(`did=${did},${cfg.ROOT_DN}`, changes, function(err){
            event.emit('update', err);
        });

        return event;
    }

    _makeChage(type, attrs){
        return new ldap.Change({
            operation: type,
            modification: attrs
        })
    }
}