const ldap = require('ldapjs');
const cfg = require('../config/ldap.cfg');
const EventEmitter = require('events');




module.exports = class LDAPClient{

    constructor() {
        this.client = ldap.createClient({
            url: cfg.URL
        });
        this.client.bind(cfg.ADMIN_DN, cfg.PASSWORD, (err)=>{});
        this.checkAttrList = new Map(); 

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