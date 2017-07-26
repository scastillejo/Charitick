let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
	desc: {
		type: String,
		required: [true, 'Description required.']
	},
	username: {
		type: String,
		required: [true, 'User name required.']
	},
	email: {
		type: String,
		required: [true, 'Email required.']
	},
	password: {
		type: String,
		required: [true, 'Password required.']
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
	accounttype: {
		type: String,
		required: [true, 'Type required.']
	}			
}, {collection:'users'});

let User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.updateUser = function(newUser, id, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
	    let item = {
		  desc: newUser.desc,
		  username: newUser.username,
		  email: newUser.email,
	      password: hash,
	      hour: newUser.hour,
	      minute: newUser.minute,
	      second: newUser.second,
	      accounttype: newUser.accounttype
		};
		User.findByIdAndUpdate(decodeId(id), {$set: item}, {upsert: true, new: true, runValidators: true},callback);
    });
  });
}

module.exports.getUserByUsernameOrEmail = function(identifier, callback){
	if(identifier.tokenId){
		if(identifier.field == 'username')
			User.findOne({ $and: [{"username":identifier.username},{"_id":{ $ne : decodeId(identifier.tokenId)}}] }, callback);
		if(identifier.field == 'email')
			User.findOne({ $and: [{"email":identifier.email},{"_id":{ $ne : decodeId(identifier.tokenId)}}] }, callback);
	} else {
		User.findOne({$or:[ {'username': identifier.username}, {'email': identifier.email}]} , callback);
	}
}

module.exports.getOrganization = function(params, callback){
	User.find({ $or: [{"hour" : {'$gte': params.hfrom}},{"hour" :{'$lt': params.to}}]}, callback);
}

function decodeId(token){
	var decoded = jwt.decode(token);
	return decoded.id;
}