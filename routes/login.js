let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let User = require('../models/da-users');
let Org = require('../models/da-org');
let PwdCompare = require('../models/pwdcomparison');
let access = require('../models/access');
let jwt = require('json-web-token');

let urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res, next) {
	res.clearCookie('_accessToken');
	res.render('login',{ message : '',data:{ 'hrefone': '', 'titleone': 'Home' }
  });
});

router.post('/', urlencodedParser, function(req,res){
  let username = req.body.username;
  let password = req.body.password;
  let isOrganization = req.body.isOrganization;
  let obj;

  if (username == undefined || username == '' || username.length > 100)
  	return res.render('login',{ message : 'Error in getting user name...', data:{ 'hrefone': '', 'titleone': 'Home' }});
  if (password == undefined || password == '' || password.length > 100)
  	return res.render('login',{ message : 'Error in getting password...', data:{ 'hrefone': '', 'titleone': 'Home' }});

  if(isOrganization == undefined)
  	obj = User;
  else
  	obj = Org;

  obj.getEntityByUsername(username, function(err, user){
	if(err) throw err;
	if(!user){
		return res.render('login',{ message : 'Unknown user or password.', data:{ 'hrefone': '', 'titleone': 'Home' }});
	}

	PwdCompare.comparePassword(password, user.password, function(err, isMatch){
		if(err) throw err;
		if(isMatch){
			jwt.encode(access.secret, access.payload(user._id, user.username), function (err, token) {
			  if (err) {
			    return console.error(err.name, err.message);
			  } 
			  else {
				res.cookie('_accessToken', token, { httpOnly: true, maxAge: 1800000 }); //30 min
				if(isOrganization == undefined)
				  	res.redirect('/');
				  else
				  	res.redirect('/organizationform');
			  }
			});
		} 
		else {
			return res.render('login',{ message : 'Invalid password.', data:{ 'hrefone': '', 'titleone': 'Home' }});
		}
	});
  });
})

module.exports = router;
