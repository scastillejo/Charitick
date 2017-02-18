module.exports.payload = function(id, name){
	let pload = {
	  "iss": id,
	  "sub": name,
	  "aud": "World",
	  "iat": 1400062400223,
	  "typ": "/online/transactionstatus/v2",
	  "request": {
	    "myTransactionId": "[myTransactionId]",
	    "merchantTransactionId": "[merchantTransactionId]",
	    "status": "SUCCESS"
	  }
	};
	return pload;
} 

module.exports.secret = "5465*gyjd987";




