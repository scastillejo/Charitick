let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let Org = require('../models/da-org');
let access = require('../models/access');

let urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res, next) {
  if(req.userid == undefined || req.userid == ''){
    let jfile = {
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

  let date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  
  let errormsg = validation(req.body.name,
                            req.body.briefdesc,
                            req.body.address,
                            req.body.state,
                            req.body.city,
                            req.body.zone,
                            req.body.phone,
                            req.body.email,
                            req.body.website,
                            req.body.category,
                            req.body.type,
                            hour,
                            minute,
                            second,
                            req.body.username,
                            req.body.password,
                            req.body.password2,
                            req.body.hint);

  if(errormsg != ''){
    res.send(errormsg);
    res.end();
    return;
  }

  let searchname = removeAccents(req.body.name.toLowerCase());

  let newOrg = new Org({
    name: req.body.name,
    briefdesc: req.body.briefdesc,
    address: req.body.address,
    state: req.body.state,
    city: req.body.city,
    zone: req.body.zone,
    phone: req.body.phone,
    email: req.body.email,
    website:req.body.website,
    category: req.body.category,
    type:req.body.type,
    hour:hour,
    minute:minute,
    second:second,
    searchname: searchname,
    username: req.body.username,
    password: req.body.password,
    hint: req.body.hint,
    active: req.body.active
  });

  let validParams = { email:req.body.email, searchname:searchname, username:req.body.username, id:req.body.inf };

  validateOrganization(validParams).then(function(msg){
    if(msg.substring(0,5) != 'Error'){
      if(req.body.inf == '-'){
        Org.createOrg(newOrg, function(err, data){
          if(err != null)
            res.send(errorHandler(err));
          if(data != undefined)
            res.send(data._id);
        });
      }
      else{
        Org.updateOrg(newOrg, req.body.inf, function(err, data){
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

let validation = (name, briefdesc, address, state, city, zone, phone, email, website, category, type, hour, minute, second, username, password, password2, hint) => {
  let errmsg = '';
  let regmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  let regphone = /^(?! )((?!  )(?! $)[a-zA-Z0-9-+() ]){1,100}$/;

  let validateField = (value, key) => {
    if(value == undefined || value == '' || value == 'select...' || value.length > 100)
     return errmsg = 'Error in getting ' + key + '...';
  }

  if(password != password2)
     errmsg = 'Error. Passwords don´t match.';

  if(hint == password)
     errmsg = 'Error. Password hint cannot be the password.';

  if(!regphone.test(phone))  
     errmsg = 'Error. Invalid phone number format...';

  if(!regmail.test(email)) 
     errmsg = 'Error. Invalid email address...';

  if(hour == undefined || minute == undefined || second == undefined)
     errmsg = 'Error in getting time data...';

  if(!regmail.test(username)) 
     errmsg = 'Error. Invalid user name. Must be an email address...';

  validateField(hint, 'password hint');
  validateField(password, 'password');
  validateField(password2, 'confirm password');
  validateField(username, 'user name');
  validateField(type, 'type of organization');
  validateField(category, 'category');
  validateField(website, 'website url');
  validateField(email, 'email address');
  validateField(phone, 'phone number');
  validateField(zone, 'zone');
  validateField(city, 'city');
  validateField(state, 'State');
  validateField(address, 'address');

  if(briefdesc == undefined || briefdesc == '' || briefdesc.length > 200)
     errmsg = 'Error in getting a brief description...';

  validateField(name, 'the organization name');

  return errmsg;
}

let validateOrganization = (params) => {
  return new Promise(function(resolve, reject){
    let exist = false;
    let msg = '';

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

let errorHandler = (err) => {
  if(err.errors != undefined){
    err.errors.map(function(key) {
      return 'Error. ' + key.message.toString();
    });
  }
  return 'Server error...';  
}

let removeAccents = (str) => {
  let convMap = {
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
  for (let i in convMap) {
    str = str.replace(new RegExp(i, "g"), convMap[i]);
  }
  return str;
}

module.exports = router;
