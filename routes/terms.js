let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

let urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res, next) {
  if(req.userid == undefined || req.userid == ''){
    res.render('terms', {data:{ 
      'hrefone': '', 'titleone': 'Home',
      'hreftwo': 'login', 'titletwo': 'Log In',
      'hrefthree': 'signup', 'titlethree': 'Sign Up'
    }});
  }
  else{
    res.render('terms', {data:{ 
      'hrefone': '', 'titleone': 'Home',
      'hreftwo': 'login', 'titletwo': 'Log Out',
      'hrefthree': 'signup', 'titlethree': req.username
    }});
  }
});

module.exports = router;