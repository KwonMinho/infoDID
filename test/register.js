const axios = require('axios');
const Chance = require('chance');
const chance = new Chance();
const didChance = new Chance(1234);

const endpoint = 'http://127.0.0.1:7788/users/register'

const newAccount = didChance.string({ length: 15 })+chance.string()

const data = {
	auth: {
		did: `did:pv:${newAccount}`,
		signature: '0x952cc6fdac39fea2b49ff8f771b',
		pubKeyID: `did:pv:${newAccount}#key-1`
	},
	info: {
		cn: chance.first(),
		sn: chance.last(),
		didGender: chance.gender(),
		didBirth: chance.birthday(),
		didCountry: chance.country(),
		didPhoneNumber: chance.phone(),
		didEmail: chance.email(),
		didJob: chance.profession(),
		didAddress: chance.address(),
		desc:  chance.string()
	}
};


async function makeGetRequest() {
	try{
		let res = await axios.post(endpoint, data);
		console.log(res.data);
	}catch(e){
		console.log("request")
		console.log(e.response.data)
	}
}


makeGetRequest();


