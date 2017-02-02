var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/da-users');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res, next) {
  res.render('pwdrecovery', { message : null, data:{'hrefone': 'login', 'titleone': 'Log In' }
  });
});

router.post('/', urlencodedParser, function(req,res){
  var username = req.body.username;

  if(username == '')
    return res.render('pwdrecovery',{ message : 'Please, type your user name', data:{'hrefone': 'login', 'titleone': 'Log In' }});

  User.getEntityByUsername(username, function(err, user){
    if(err) throw err;
    if(user){
      if(user.hint != ''){
        return res.render('pwdrecovery',{ message : 'Your password hint is: "' + user.hint + '"', data:{'hrefone': 'login', 'titleone': 'Log In' }});
      }
      else
        return res.render('pwdrecovery',{ message : 'Error in getting password hint', data:{'hrefone': 'login', 'titleone': 'Log In' }});
    }
    else
      return res.render('pwdrecovery',{ message : 'Could not find user', data:{'hrefone': 'login', 'titleone': 'Log In' }});
  });
});

module.exports = router;