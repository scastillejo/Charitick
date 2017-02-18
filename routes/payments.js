let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let Payment = require('../models/da-payments');
let mongoose = require('mongoose');

let urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res, next) {
    if(req.userid != '' && req.query.id != undefined){
    	Payment.getPaymentsByEntityId(req.userid, req.query.id, function(err, data){
    	if(err) throw err;
    	if(data){
            if(req.query.id == 'user'){
                data.hrefone = '';
                data.titleone = 'Home';
                data.hrefthree = 'signup';
            }
            else{
                data.hrefone = 'organizationform';
                data.titleone = 'Organization';
                data.hrefthree = 'organizationform';
            }
            data.hreftwo = 'login';
            data.titletwo = 'Log Out';
            data.titlethree = req.username;
    		res.render('payments', {data:data});
    	}
        });
    }  	
    else
        res.redirect('login');
});

module.exports = router;