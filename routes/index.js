let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let access = require('../models/access');
let Org = require('../models/da-org');
let User = require('../models/da-users');
let UserOrder = require('../models/da-payments');

let urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res, next) {
	if(req.userid == undefined || req.userid == ''){
    res.render('index', {data:{
      'username': '',
      'briefdesc': '',
      'address': '',
      'state': '',  
      'city': '',
      'zone': '',   
      'phone': '',
      'email': '',
      'website': '',
      'hrefone': 'signup',
      'titleone': 'Sign Up',
      'hreftwo': 'login',
      'titletwo': 'Log In',
      'hrefthree': 'organizationform',
      'titlethree': 'Organization?'
    }
   });
  }
  else{
    User.getUserById(req.userid, function(err, user){
		if(err) throw err;
		if(user){
			data = user.toJSON();
			data.hrefone = 'payments?id=user';
			data.titleone = 'Payments';
			data.hreftwo = 'login';
			data.titletwo = 'Log Out';
      data.hrefthree = 'signup';
      data.titlethree = user.username;
			res.render('index', {data:data});
		}
    else{
      res.clearCookie('_accessToken');
      res.render('index', {data:{
        'username': '',
        'briefdesc': '',
        'address': '',
        'state': '',  
        'city': '',
        'zone': '',   
        'phone': '',
        'email': '',
        'website': '',
        'hrefone': 'signup',
        'titleone': 'Sign Up',
        'hreftwo': 'login',
        'titletwo': 'Log In',
        'hrefthree': 'organizationform',
        'titlethree': 'Organization?'
      }
     });
    }
  });
  }
});

router.post('/', urlencodedParser, function(req,res){
  let flag = req.body.flag;

  if(flag == 'find'){
    let hour = req.body.hour;
    let minute = req.body.minute;
    let second = req.body.second;

    if(hour == undefined || minute == undefined || second == undefined){
       res.send('Error in getting time data...');
       res.end();
       return;
    }

    hour = +hour;
    minute = +minute;
    second = +second;

    let from = hour - 6;
    let to = hour + 6;

    //Searches in a -6 +6 hour range 
    if(from < 0 || to > 23){
      switch(hour){
        case 23:
          from = 18;
          to = 5;
          break;
        case 22:
          from = 17;
          to = 4;
          break;
        case 21:
          from = 16;
          to = 3;
          break;
        case 20:
          from = 15;
          to = 2;
          break; 
        case 19:
          from = 14;
          to = 1;
          break;
        case 18:
          from = 13;
          to = 0;
          break;  
        case 0:
          from = 19;
          to = 5;
          break;
        case 1:
          from = 20;
          to = 6;
          break;
        case 2:
          from = 21;
          to = 7;
          break;
        case 3:
          from = 22;
          to = 8;
          break; 
        case 4:
          from = 23;
          to = 9;
          break;
        case 5:
          from = 0;
          to = 10;
          break;
      }
    }
    let params = { from, to };

    Org.getOrganization(params, function(err, data){
      if(err) res.send(err);
      if(data){
        var curr = data[0].hour;
        var datarecord = data[0];
        var diff = Math.abs (hour - curr);
        var i = data.length;

        //Looks up the same or closest hour
        while (i--) {
          var newdiff = Math.abs (hour - data[i].hour);
          if (newdiff < diff) {
              diff = newdiff;
              curr = data[i].hour;
              datarecord = data[i]; //if it's the only record, this will be returned; and same with the rest of datarecord appearances.
          }
        }

        var currhour = curr;
        var i = data.length; //Declared again to reuse in while.
        var hcount = 0;
        var minutearray = {};

        //Checks whether the hour is more than once in the array.
        while (i--) {
          if(data[i].hour == currhour){
            minutearray[hcount] = data[i]; //I take the chance to fill a minute array in case there's more than one hour record.
            hcount += 1;
          }
        }

        //If it is, the same process is repeated but with a smaller array.
        if(hcount > 1){
          var curr = minutearray[0].minute;
          datarecord = minutearray[0];
          var diff = Math.abs (minute - curr);
          var i = hcount; //Equals the array length.

          while (i--) {
            var newdiff = Math.abs (minute - minutearray[i].minute);
            if (newdiff < diff) {
                diff = newdiff;
                curr = minutearray[i].minute;
                datarecord = minutearray[i];
            }
          }

          var currminute = curr;
          var i = hcount;
          var mcount = 0;
          var secondarray = {};

          while (i--) {
            if(minutearray[i].minute == currminute){
              secondarray[mcount] = minutearray[i];
              mcount += 1;
            }
          }
          if(mcount > 1){
            var curr = secondarray[0].second;
            datarecord = secondarray[0];
            var diff = Math.abs (second - curr);
            var i = mcount;

            while (i--) {
              var newdiff = Math.abs (second - secondarray[i].second);
              if (newdiff < diff) {
                  diff = newdiff;
                  curr = secondarray[i].second;
                  datarecord = secondarray[i];
              }
            }
            
            var currsecond = curr;
            var i = mcount;
            var scount = 0;

            while (i--) {
              if(secondarray[i].second == currsecond){
                scount += 1;
              }
            }

            //If there is a triple match, a random one is selected.
            if(scount > 1){
              var rand = Math.floor(Math.random()*scount);
              datarecord = secondarray[rand];
            }
          }
        }
        res.send(datarecord);
      }
      else
        res.send('Error. No organization found near the time clicked...');
    })
  }
  if(flag == 'donate'){
    //to do
  }
});

module.exports = router;