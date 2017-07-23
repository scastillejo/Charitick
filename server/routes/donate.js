import express from 'express';
import authenticate from '../middlewares/authenticate';
import User from '../models/da-users';

let router = express.Router();

router.post('/', authenticate, (req, res) => {
  let flag = req.body.flag;
  
  if(flag == 'find'){
    let hour = req.body.hour;
    let minute = req.body.minute;
    let second = req.body.second;

    hour = +hour;
    minute = +minute;
    second = +second;

    User.getOrganization(getTimeRange(hour), function(err, data){
      if(err) res.send(err);
      if(data){
        var curr = data[0].hour;
        var datarecord = data[0];
        var diff = Math.abs (hour - curr);

        //Looks up the same or closest hour
        data.map(item => {
          var newdiff = Math.abs (hour - item.hour);
          if (newdiff < diff) {
              diff = newdiff;
              curr = item.hour;
              datarecord = item; //if it's the only record, this will be returned; and same with the rest of datarecord appearances.
          }
        });

        var currhour = curr;
        var hcount = 0;
        var minutearray = [];

        //Checks whether the hour is more than once in the array.
        data.map(item => {
          if(item.hour == currhour){
            minutearray[hcount] = item; //I take the chance to fill a minute array in case there's more than one hour record.
            hcount += 1;
          }
        });

        //If it is, the same process is repeated but with a smaller array.
        if(hcount > 1){
          var curr = minutearray[0].minute;
          datarecord = minutearray[0];
          var diff = Math.abs (minute - curr);

          minutearray.map(item => {
            //If it's the same hour, it has to find closest minute.
            if(hour == currhour){
              var newdiff = Math.abs (minute - item.minute);
              if (newdiff < diff) {
                  diff = newdiff;
                  curr = item.minute;
                  datarecord = item;
              }
            }
            //current time > item, finds biggest minute (time closer to current time).
            if(hour > currhour){
              if (item.minute > curr) {
                  curr = item.minute;
                  datarecord = item;
              }
            }
            //current time < item, finds smallest minute (time closer to current time).
            if(hour < currhour){
              if (item.minute < curr) {
                  curr = item.minute;
                  datarecord = item;
              }
            }
          });

          var currminute = curr;
          var mcount = 0;
          var secondarray = [];

          minutearray.map(item => {
            if(item.minute == currminute){
              secondarray[mcount] = item;
              mcount += 1;
            }
          });

          if(mcount > 1){
            var curr = secondarray[0].second;
            datarecord = secondarray[0];
            var diff = Math.abs (second - curr);

            secondarray.map(item => {
              if(hour == currhour){
                var newdiff = Math.abs (second - item.second);
                if (newdiff < diff) {
                    diff = newdiff;
                    curr = item.second;
                    datarecord = item;
                }
              }
              if(hour > currhour){
                if (item.second > curr) {
                    curr = item.second;
                    datarecord = item;
                }
              }
              if(hour < currhour){
                if (item.second < curr) {
                    curr = item.second;
                    datarecord = item;
                }
              }
            });
            
            var currsecond = curr;
            var scount = 0;

            secondarray.map(item => {
              if(item.second == currsecond){
                scount += 1;
              }
            });

            //If there is a triple match, a random one is selected.
            if(scount > 1){
              var rand = Math.floor(Math.random()*scount);
              datarecord = secondarray[rand];
            }
          }
        }
        res.json(datarecord);
      }
      else
      	res.status(500).json({ error: 'Error. No organization found near the time clicked...' });
    })
  }
  if(flag == 'donate'){
    //to do
  }
});

let getTimeRange = (hour) => {
  let hfrom = hour - 6;
  let to = hour + 6;
  let params = {};

  //Searches in a -6 +6 hour range 
  if(hfrom < 0 || to > 23){
    switch(hour){
      case 23:
        hfrom = 18;
        to = 5;
        break;
      case 22:
        hfrom = 17;
        to = 4;
        break;
      case 21:
        hfrom = 16;
        to = 3;
        break;
      case 20:
        hfrom = 15;
        to = 2;
        break; 
      case 19:
        hfrom = 14;
        to = 1;
        break;
      case 18:
        hfrom = 13;
        to = 0;
        break;  
      case 0:
        hfrom = 19;
        to = 5;
        break;
      case 1:
        hfrom = 20;
        to = 6;
        break;
      case 2:
        hfrom = 21;
        to = 7;
        break;
      case 3:
        hfrom = 22;
        to = 8;
        break; 
      case 4:
        hfrom = 23;
        to = 9;
        break;
      case 5:
        hfrom = 0;
        to = 10;
        break;
    }
  }
  return params = { hfrom, to };
}

export default router;
