var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/da-users');
var access = require('../models/access');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res, next) {
    if(req.userid == undefined || req.userid == ''){
      res.render('signup', {data:{ 
        'username': '',
        'password': '',
        'hrefone': 'login',
        'titleone': 'Log In',
        'inf': '-'}
      });
    }  
    else
    {
      User.getUserById(req.userid, function(err, data){
        if(err) throw err;
        if(data){
          data = data.toJSON();
          data.inf = 'ok';
          data.hrefone = '';
          data.titleone = 'Home';
          data.hreftwo = 'login';
          data.titletwo = 'Log Out';
          data.hrefthree = 'signup';
          data.titlethree = req.username;
          res.render('signup', {data:data});
        }
      });
    }
});

router.post('/', urlencodedParser, function(req,res){
  var userid = req.userid;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var hint = req.body.hint;
  var reg = /^(?! )((?!  )(?! $)[a-zA-Z ]){1,100}$/;
  var regusername = /^(?! )((?!  )(?! $)[a-zA-Z0-9 ]){1,100}$/;      
  var regmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  var regphone = /^(?! )((?!  )(?! $)[a-zA-Z0-9-+() ]){1,100}$/;

  if(username == undefined || username == '' || username.length > 100){
     res.send('Error in user email...');
     res.end();
     return;
  }
  if(!regmail.test(username)) {     
     res.send('Invalid email address...');
     res.end();
     return;
  }
  if(password == undefined || password == '' || password.length > 100){
     res.send('Error in getting password.');
     res.end();
     return;
  }
  if(password2 == undefined || password2 == '' || password2.length > 100){
     res.send('Error in getting confirm password.');
     res.end();
     return;
  }
  if(password != password2){
     res.send('Passwords don´t match.');
     res.end();
     return;
  }
  if(hint == undefined || hint == '' || hint.length > 100){
     res.send('Error in getting password hint.');
     res.end();
     return;
  }
  if(hint == password){
     res.send('Password hint cannot be the password.');
     res.end();
     return;
  }

  var newUser = new User({
    username: username,
    password: password,
    hint: hint
  });

  if(req.userid == undefined || req.userid == ''){
    User.createUser(newUser, function(err, data){
      if(err != null)
        res.send(errorHandler(err));
      if(data != undefined)
        res.send('Data entered.');
    });
  }
  else{
    User.updateUser(newUser, req.userid, function(err, data){
      if(err != null)
        res.send(errorHandler(err));
      if(data != undefined)
        res.send('Data entered.');
    });
  }
})

function errorHandler(err){
  if(err['errors'] != undefined){
    Object.keys(err['errors']).forEach(function(key) {
      return err['errors'][key]['message'].toString();
    });
  }
  if(err['code'] == 11000){
    var str = JSON.stringify(err);
    var from = str.indexOf("dborders.users");
    var to = str.indexOf("dup key");

    str = str.substring(from,to-1);

    if(str == 'dborders.users.$username_1')
      return 'Error. The user email is already used.';

    return 'Error. -user email- is already used.';
  }
  return 'Server error...';  
}

router.delete('/', urlencodedParser, function(req,res){
  if(req.userid != undefined && req.userid != ''){
   var inf = req.body.inf;

   if(inf != undefined && inf != '' && inf != '-'){
      User.deleteUserAccount(req.userid, function(err){
      if(err) res.send(err);
      res.send('Account deleted.');
      res.end();
      return;
     });
   }
   else{
     res.send('Error. You must first create an account.');
     res.end();
     return;
   }
 }
 else{
  res.send('Please, log in again.');
  res.end();
  return;
 }
});

module.exports = router;
