let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let User = require('../models/da-users');
let access = require('../models/access');

let urlencodedParser = bodyParser.urlencoded({ extended: false });

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
  let userid = req.userid;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;
  let hint = req.body.hint;
  let regmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  let errmsg = '';

  let validate = (param, key) => {
    if(param == undefined || param == '' || param.length > 100)
     return errmsg = 'Error in getting ' + key + '...';
  }

  if(!regmail.test(username))  
     errmsg ='Error. Invalid user name. Must be an email address...';

  if(password != password2)
     errmsg ='Error. Passwords don´t match.';

  if(hint == password)
     errmsg ='Error. Password hint cannot be the password.';

  validate(hint, 'hint');
  validate(password2, 'confirm password');
  validate(password, 'password');
  validate(username, 'user name');

  if(errmsg != ''){
    res.send(errmsg);
    res.end();
    return;
  }

  let newUser = new User({
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

let errorHandler = (err) => {
  if(err['errors'] != undefined){
    Object.keys(err['errors']).forEach(function(key) {
      return err['errors'][key]['message'].toString();
    });
  }
  if(err['code'] == 11000){
    let str = JSON.stringify(err);
    let from = str.indexOf("dbcharitick.users");
    let to = str.indexOf("dup key");

    str = str.substring(from,to-1);

    if(str == 'dbcharitick.users.$username_1')
      return 'Error. The user email is already used.';

    return 'Error. Possible duplicate data.';
  }
  return 'Server error...';  
}

router.delete('/', urlencodedParser, function(req,res){
  if(req.userid != undefined && req.userid != ''){
   let inf = req.body.inf;

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
