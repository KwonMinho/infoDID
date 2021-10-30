const axios = require('axios');
const endpoint = 'http://127.0.0.1:7788/admin/users'


async function makeGetRequest() {
	try{
		let res = await axios.get(endpoint);
		console.log(res.data);
	}catch(e){
		console.log("error!")
		console.log(e.response.data)
	}
}


makeGetRequest();


