var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentsSchema = new Schema({
	name: {
		type: String
	},
	address: {
		type: String
	},
	state: {
		type: String
	},	
	city: {
		type: String
	},
	zone: {
		type: String
	},		
	phone: {
		type: String
	},
	email: {
		type: String
	},
	payment: {
		type: String
	},	
	date: {
		type: String
	},	
	userid: {
		type: String
	},
	orgid: {
		type: String
	}
},{collection : 'payments'});

var PaymentsModel = module.exports = mongoose.model('PaymentsModel', PaymentsSchema);

module.exports.createOrderRecord = function(newPaymentRecord, callback){
    newPaymentRecord.save(callback);
}

module.exports.getPaymentsByEntityId = function(id, type, callback){
	if(type == 'user')
		PaymentsModel.find({ userid: id},'',callback)
	else
		PaymentsModel.find({ orgid: id},'',callback)
}


