const axios = require('axios');
const endpoint = 'http://127.0.0.1:7788/users/pass-on'

const accessToken = '0x952cc6fdac39fea2b49ff8f771b'

async function makeGetRequest() {
	try{
		let res = await axios.get(endpoint, {
			headers:{
				'Authorization': `Bearer ${accessToken}`
			},
			params: {
			  did : 'did:pv:071153262e20979c93f6dbd98ed734e0560ea769',
			  pubKeyID: 'did:pv:071153262e20979c93f6dbd98ed734e0560ea769#key-1',
			  //attrs: ['didBirth','didCountry','didPhoneNumber']
			}
		});
		console.log(res.data);
	}catch(e){
		console.log("error!")
		console.log(e.response.data)
	}
}


makeGetRequest();


