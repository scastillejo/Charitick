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
  let errormsg = validation(req.body.username, req.body.password, req.body.password2, req.body.hint);

  if(errormsg != ''){
    res.send(errormsg);
    res.end();
    return;
  }

  let newUser = new User({
    username: req.body.username,
    password: req.body.password,
    hint: req.body.hint
  });

  let editUserCallback = (err, data) => {
    if(err != null)
      res.send(errorHandler(err));
    if(data != undefined)
      res.send('User data entered.');
  }

  if(req.userid == undefined || req.userid == '')
    User.createUser(newUser, editUserCallback);
  else
    User.updateUser(newUser, req.userid, editUserCallback);
})

let validation = (username, password, password2, hint) => {
  let errmsg = '';
  let regmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  let validateField = (value, key) => {
    if(value == undefined || value == '' || value.length > 100)
     return errmsg = 'Error in getting ' + key + '...';
  }

  if(!regmail.test(username))  
     errmsg ='Error. Invalid user name. Must be an email address...';

  if(password != password2)
     errmsg ='Error. Passwords don´t match.';

  if(hint == password)
     errmsg ='Error. Password hint cannot be the password.';

  validateField(hint, 'hint');
  validateField(password2, 'confirm password');
  validateField(password, 'password');
  validateField(username, 'user name');

  return errmsg;
}

let errorHandler = (err) => {
  if(err.errors != undefined){
    err.errors.map(function(key) {
      return 'Error. ' + key.message.toString();
    });
  }
  if(err.code == 11000){
    let str = JSON.stringify(err);
    let from = str.indexOf("dbcharitick.users");
    let to = str.indexOf("dup key");

    str = str.substring(from,to-1);

    if(str == 'dbcharitick.users.$username_1')
      return 'Error. The user email is already used.';

    return 'Error. Possible duplicate data.';
  }
  return 'Error in Server...';  
}

router.delete('/', urlencodedParser, function(req,res){
  let sendResponse = (msg) => {
    res.send(msg);
    res.end();
    return;
  }

  if(req.userid != undefined && req.userid != ''){
   let inf = req.body.inf;

   if(inf != undefined && inf != '' && inf != '-'){
      User.deleteUserAccount(req.userid, function(err){
      if(err) sendResponse(err)
      else {
        res.clearCookie('_accessToken');
        sendResponse('Account deleted.');
      }
     });
   }
   else
    sendResponse('Please, log in again.')
 }
 else
  sendResponse('Error. You must first create an account.')
});

module.exports = router;
