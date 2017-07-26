import express from 'express';
import commonValidations from '../shared/validations/signup';
import bcrypt from 'bcrypt';
import isEmpty from 'lodash/isEmpty';
import User from '../models/da-users';

let router = express.Router();

router.post('/', (req, res) => {
  if(req.body.flag != 'exist'){
    let { errors } = commonValidations(req.body);
    let isValid = isEmpty(errors);

    if (isValid) {
      let date = new Date();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();

      let newUser = new User({
        desc: req.body.desc,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        hour: hour,
        minute: minute,
        second: second,
        accounttype: req.body.accounttype
      });
      if(req.body.tokenId){
        User.updateUser(newUser, req.body.tokenId, function(err, data){
          if(err != null){
            res.status(500).json({ error: err });
          }
          if(data != undefined)
            res.json({ success: true });
        });
      }
      else{
        User.createUser(newUser, (err, data) => {
          if(err != null)
            res.status(500).json({ error: err });
          if(data != undefined){
            res.json({ success: true });
          }
        });
      }
    }
    else {
      res.status(400).json({ error:errors });
    }
  }
  else{
    User.getUserByUsernameOrEmail(req.body, (err, user) => {
    if(user)
      res.json({ user });
    else
      res.json({});
  });
  }
});

export default router;
