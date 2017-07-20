let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
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
	      accounttype: newUser.type
		};
		User.findByIdAndUpdate(id, {$set: item}, {upsert: true, new: true, runValidators: true},callback);
    });
  });
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	User.findOne({username: username}, callback);
}

module.exports.getUserByUsernameOrEmail = function(identifier, callback){
	User.findOne({$or:[ {'username': identifier.username}, {'email': identifier.email}]} , callback);
}

module.exports.getOrganization = function(params, callback){
	User.find({ $or: [{"hour" : {'$gte': params.hfrom}},{"hour" :{'$lt': params.to}}]}, callback);
}

module.exports.deleteUserAccount = function(id, callback){
	User.findOneAndRemove({ _id: id }, callback);
}
