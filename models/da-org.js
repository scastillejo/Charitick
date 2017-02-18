let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;

let OrgSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name required.']
	},
	briefdesc: {
		type: String,
		required: [true, 'Description required.']
	},
	address: {
		type: String,
		required: [true, 'Address required.']
	},
	state: {
		type: String,
		required: [true, 'State required.']
	},	
	city: {
		type: String,
		required: [true, 'City required.']
	},
	zone: {
		type: String,
		required: [true, 'Zone required.']
	},		
	phone: {
		type: String,
		required: [true, 'Phone required.']
	},
	email: {
		type: String,
		required: [true, 'Email required.']
	},
	website: {
		type: String,
		required: [true, 'Website required.']
	},
	category: {
		type: String,
		required: [true, 'Category required.']
	},	
	type: {
		type: String,
		required: [true, 'Type required.']
	},		
	hour: {
		type: Number,
		required: [true, 'Error in getting time data.']
	},
	minute: {
		type: Number,
		required: [true, 'Error in getting time data.']
	},
	second: {
		type: Number,
		required: [true, 'Error in getting time data.']
	},
	searchname: {
		type: String,
		required: [true, 'Error in search name.']
	},
	username: {
		type: String,
		required: [true, 'User name required.']
	},
	password: {
		type: String,
		required: [true, 'Password required.']
	},
	hint: {
		type: String,
		required: [true, 'Password hint required.']
	},
	active: {
		type: String,
		required: [true, 'Active state required.']
	}
},{collection : 'organization'});

let OrgModel = module.exports = mongoose.model('OrgModel', OrgSchema);

module.exports.createOrg = function(newOrg, callback){
    bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newOrg.password, salt, function(err, hash) {
	        newOrg.password = hash;
	        newOrg.save(callback);
	    });
	});
}
module.exports.updateOrg = function(newOrg, id, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newOrg.password, salt, function(err, hash) {
		    let item = {
			  name : newOrg.name,
			  briefdesc : newOrg.briefdesc,
			  address : newOrg.address,
			  state: newOrg.state,
		      city: newOrg.city,
		      zone: newOrg.zone,
		      phone: newOrg.phone,
		      email: newOrg.email,
		      website: newOrg.website,
		      category: newOrg.category,
		      type: newOrg.type,
		      hour: newOrg.hour,
		      minute: newOrg.minute,
		      second: newOrg.second,
		      searchname: newOrg.searchname,
		      username: newOrg.username,
		      password: hash,
		      hint: newOrg.hint,
		      active: newOrg.active
			};
		   OrgModel.findByIdAndUpdate(id, {$set: item}, {upsert: true, new: true, runValidators: true},callback);
	    });
	});
}

module.exports.getEntityByUsername = function(username, callback){
	OrgModel.findOne({username: username}, callback);
}

module.exports.validateEntity = function(params, callback){
	if(params.orgid != '-'){
		if(params.field == 'email')
			OrgModel.findOne({ $and: [{"email":params.email},{"_id":{ $ne : params.orgid}}] }, callback);
		if(params.field == 'searchname')
			OrgModel.findOne({ $and: [{"searchname":params.searchname},{"_id":{ $ne : params.orgid}}] }, callback);
		if(params.field == 'username')
			OrgModel.findOne({ $and: [{"username":params.username},{"_id":{ $ne : params.orgid}}] }, callback);
	}
	if(params.orgid == '-'){
		if(params.field == 'email')
			OrgModel.findOne({"email":params.email}, callback);
		if(params.field == 'searchname')
			OrgModel.findOne({"searchname":params.searchname}, callback);
		if(params.field == 'username')
			OrgModel.findOne({"username":params.username}, callback);
	}
}

module.exports.getOrganization = function(params, callback){
	OrgModel.find({ $or: [{"hour" : {'$gte': params.from}},{"hour" :{'$lt': params.to}}]}, callback);
}

module.exports.getOrganizationById = function(id, callback){
	OrgModel.findById(id, callback);
}


