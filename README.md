# infoDID

## configuration

## include custom schema and build Image

1. git clone docker-openldap
2. add here custom.schema file [runtime.config/extend-osixia-openldap/bootstrap/schema]
3. edit Makefile& make build
4. run ldap container
5. confirm to "custom.ldif"  in '/etc/ldap/slpd.d/cn=config/cn=schema'

### run ldap on docker

```
docker run -p 3999:389 -p 6377:636 --restart=always --env LDAP_DOMAIN="infoDID.com" --env LDAP_TLS=false --env LDAP_ADMIN_PASSWORD=pslab --name infoDID-ldap --detach alsgh458/info-ldap:0.0.3
```

<br>

## restful API

### 1. register user info

API: POST, '/users/register'

request
```
{
    auth: {
        did: did:pv:071153262e20979c93f6dbd98ed734e0560ea769, 
        signature:0x952cc6fdac6df830babcfb29ddad4c1e2e4440422b80b4d105a5f441b6163b9d20720df7df4b9f096888af0bda4b477c43e8d97b8d49496d639fea2b49ff8f771b , 
        pubKeyID: did:pv:071153262e20979c93f6dbd98ed734e0560ea769#key-1
    }
    info: {
        cn: 'Manho',
        sn: 'Lee',
        didGender: 'Mr',
        didBirth: '9999',
        didCountry: 'kor',
        didphoneNumber: '010-2000-0000',
        didEmail: 'alsggh458@naver.com',
        didJob: 'student',
        didAddress: 'ulsan',
        desc: 'Hello world'
    }
}
```


### 2. update user info

API: POST, '/users/update'

request
```
{
    auth: {
        did: did:pv:071153262e20979c93f6dbd98ed734e0560ea769, 
        signature:0x952cc6fdac6df830babcfb29ddad4c1e2e4440422b80b4d105a5f441b6163b9d20720df7df4b9f096888af0bda4b477c43e8d97b8d49496d639fea2b49ff8f771b , 
        pubKeyID: did:pv:071153262e20979c93f6dbd98ed734e0560ea769#key-1
    }
    info: {
        replace: {
            desc: 'changeComplete'
        },
        add: {
            didPhoneNumber: '010-4065-8361'
        },
        delete: {
            didEmail: null
        }
    }
}
```


### 3. get user info

API: GET, '/user/info'

```
headers: {
    'Authorization': `Bearer ${signature }`
}
query: {
    did,
    pubKeyID,
    attrs //(options), type=array
}
```
