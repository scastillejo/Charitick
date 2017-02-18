let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

let urlencodedParser = bodyParser.urlencoded({ extended: false });

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