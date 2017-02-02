var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Org = require('../models/da-org');
var access = require('../models/access');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res, next) {
  if(req.userid == undefined || req.userid == ''){
    var jfile = {
      'name': '',
      'briefdesc': '',
      'address': '',
      'state':'', 
      'city': '',
      'zone': '',   
      'phone': '',
      'email': '',
      'category': '', 
      'type':'',
      'searchname': '',
      'username': '',
      'hint': '',
      'hrefone' : 'login',
      'titleone' : 'Log In',
      'inf': '-'
    };
    res.render('organizationform', {data:jfile});
  }
  else
  {
    Org.getOrganizationById(req.userid, function(err, org){
      if(err) throw err;
      if(org){
        org = org.toJSON();
        org.inf = org._id;
        org.hrefone = 'payments?id=org';
        org.titleone = 'Payments';
        org.hreftwo = 'login';
        org.titletwo = 'Log Out';
        res.render('organizationform', {data:org});
      }
    });
  }
});

router.post('/', urlencodedParser, function(req,res){
  var orgid = req.body.inf;
  var name = req.body.name;
  var briefdesc = req.body.briefdesc;
  var address = req.body.address;
  var state = req.body.state;
  var city = req.body.city;
  var zone = req.body.zone;
  var phone = req.body.phone;
  var email = req.body.email;
  var website = req.body.website;
  var category = req.body.category;
  var type = req.body.type;
  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var searchname = removeAccents(name.toLowerCase());
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var hint = req.body.hint;
  var active = req.body.active;
  var regmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  var regphone = /^(?! )((?!  )(?! $)[a-zA-Z0-9-+() ]){1,100}$/;

  if(name == undefined || name == '' || name.length > 100){
     res.send('Error in getting the organization name.');
     res.end();
     return;
  }
  if(briefdesc == undefined || briefdesc == '' || briefdesc.length > 200){
     res.send('Error in getting a description...');
     res.end();
     return;
  }
  if(address == undefined || address == '' || address.length > 100){
     res.send('Error in getting address...');
     res.end();
     return;
  }
  if(state == undefined || state == '' || state.length > 100){
     res.send('Error in getting a State...');
     res.end();
     return;
  }
  if(city == undefined || city == '' || city == 'select...' || city.length > 100){
     res.send('Error in getting a city...');
     res.end();
     return;
  }
  if(zone == undefined || zone == '' || zone == 'select...' || zone.length > 100){
     res.send('Error in getting a zone...');
     res.end();
     return;
  }
  if(phone == undefined || phone == '' || phone.length > 100){
     res.send('Error in getting phone number...');
     res.end();
     return;
  }
  if(!regphone.test(phone)) {     
     res.send('Invalid phone number format...');
     res.end();
     return;
  }
  if(email == undefined || email == '' || email.length > 100){
     res.send('Error in getting email...');
     res.end();
     return;
  }
  if(!regmail.test(email)) {     
     res.send('Invalid email address...');
     res.end();
     return;
  }
  if(website == undefined || website == '' || website.length > 100){
     res.send('Error in getting website address...');
     res.end();
     return;
  }
  if(category == undefined || category == '' || category.length > 100){
     res.send('Error in getting a category...');
     res.end();
     return;
  }
  if(type == undefined || type == '' || type.length > 100){
     res.send('Error in getting a type...');
     res.end();
     return;
  }
  if(hour == undefined || minute == undefined || second == undefined){
     res.send('Error in getting time data...');
     res.end();
     return;
  }
  if(username == undefined || username == '' || username.length > 100){
     res.send('Error in user name...');
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

  var newOrg = new Org({
    name: name,
    briefdesc: briefdesc,
    address: address,
    state: state,
    city: city,
    zone: zone,
    phone: phone,
    email: email,
    website:website,
    category: category,
    type:type,
    hour:hour,
    minute:minute,
    second:second,
    searchname: searchname,
    username: username,
    password: password,
    hint: hint,
    active: active
  });

  var validParams = { email, searchname, username, orgid };

  validateOrganization(validParams).then(function(msg){
    if(msg.substring(0,5) != 'Error'){
      if(orgid == '-'){
        Org.createOrg(newOrg, function(err, data){
          if(err != null)
            res.send(errorHandler(err));
          if(data != undefined)
            res.send(data._id);
        });
      }
      else{
        Org.updateOrg(newOrg, orgid, function(err, data){
          if(err != null)
            res.send(errorHandler(err));
          if(data != undefined)
            res.send('Data entered.');
        });
      }
    }
    else
      res.send(msg);
   }).catch(function(error){
    res.send('Error. '+ error);
  });
})

function validateOrganization(params){
  return new Promise(function(resolve, reject){
    var exist = false;
    var msg = '';

    params.field = 'searchname';
    Org.validateEntity(params, function(err, org){
      if(err)
        reject(err);
      if(org)
        msg = 'Error. The organization name already exists...';

      params.field = 'email';
      Org.validateEntity(params, function(err, org){
        if(err)
          reject(err);
        if(msg == ''){
          if(org)
            msg = 'Error. The email already exists...';
        }

        params.field = 'username';
        Org.validateEntity(params, function(err, org){
          if(err)
            reject(err);
          if(msg == ''){
            if(org)
              resolve('Error. The user email already exists...');
            else
              resolve('--------');
          }
          else
            resolve(msg);
        });
      });
    });
  });
}

function errorHandler(err){
  if(err['errors'] != undefined){
    Object.keys(err['errors']).forEach(function(key) {
      return err['errors'][key]['message'].toString();
    });
  }
  return 'Server error...';  
}

function removeAccents(str) {
  var convMap = {
      "á" : "a",
      "Á" : "a",
      "é" : "e",
      "É" : "e",
      "í" : "i",
      "Í" : "i",
      "ó" : "o",
      "Ó" : "o",
      "ú" : "u",
      "Ú" : "u",
      "ü" : "u"
  }
  for (var i in convMap) {
    str = str.replace(new RegExp(i, "g"), convMap[i]);
  }
  return str;
}

module.exports = router;
