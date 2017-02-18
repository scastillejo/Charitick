let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
	username: {
		type: String,
		required: [true, 'User email required.']
	},
	password: {
		type: String,
		required: [true, 'Password required.']
	},
	hint: {
		type: String,
		required: [true, 'Password hint required.']
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
		      username: newUser.username,
		      password: hash,
		      hint: newUser.hint
			};
			User.findByIdAndUpdate(id, {$set: item}, {upsert: true, new: true, runValidators: true},callback);
	    });
	});
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getEntityByUsername = function(username, callback){
	User.findOne({username: username}, callback);
}

module.exports.deleteUserAccount = function(id, callback){
	User.findOneAndRemove({ _id: id }, callback);
}