var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res, next) {
  if(req.userid == undefined || req.userid == ''){
    res.render('aboutorganization', {data:{ 
      'hrefone': 'organizationform', 'titleone': 'Organization',
      'hreftwo': 'login', 'titletwo': 'Log In'
    }});
  }
  else{
    res.render('aboutorganization', {data:{ 
      'hrefone': 'organizationform', 'titleone': 'Organization',
      'hreftwo': 'login', 'titletwo': 'Log Out'
    }});
  }
});

module.exports = router;