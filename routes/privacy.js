var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res, next) {
  if(req.userid == undefined || req.userid == ''){
    res.render('privacy', {data:{ 
      'hrefone': '', 'titleone': 'Home',
      'hreftwo': 'login', 'titletwo': 'Log In',
      'hrefthree': 'signup', 'titlethree': 'Sign Up'
    }});
  }
  else{
    res.render('privacy', {data:{ 
      'hrefone': '', 'titleone': 'Home',
      'hreftwo': 'login', 'titletwo': 'Log Out',
      'hrefthree': 'signup', 'titlethree': req.username
    }});
  }
});

module.exports = router;