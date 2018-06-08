var express = require('express');
const Usermodel = require('../models/passUserModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.post('/register', (req, res, next) => {
  console.log(req.body);

      // Form Validator
      req.checkBody('username','Name field is required').notEmpty();
      req.checkBody('username','username should be atleast 5 chars long').isLength({min : 5});
      req.checkBody('email','Email field is required').notEmpty();
      req.checkBody('email','Email is not valid').isEmail();
      req.checkBody('password','Password field is required').notEmpty();
      req.checkBody('confirmpassword','Passwords do not match').equals(req.body.password);


  const errors = req.validationErrors();

  if(errors) {
    console.log(errors);
    res.redirect('/');
  }else {

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if(err) {
        console.log('Error while hasing' + err);
        res.redirect('/');
      } else {
        const userModel = new Usermodel({
          _id : new mongoose.Types.ObjectId(),
          username : req.body.username,
          email : req.body.email,
          password : hash
        });
      
        userModel.save()
          .then((result) => {

            //passport login session 

            Usermodel.findOne({username :  req.body.username})
                    .exec()
                    .then((result) => {
                      //successfully found the user with the given name
                      console.log('Found user details', result);
                      console.log('Results user_id is ', result.id);
                      const user_id = result.id;
                      //this login function comes from passport which will store the data passed to it in the sesssion via passport.serialize and extract the data from passport.deserialize
                      req.login(user_id, (err) => {
                        if(err) {
                          return res.status(500).send({
                            message : 'error in passport login part while storing data in session'
                          });
                        } else {

                          //successfully generated cookie here and redirected
                          res.redirect('profile');
                        }
                      });
                    })
                    .catch((err) => {
                      //error while fetching the user with the given username
                      console.log('Error while fetching the user with the given data');
                    })


      
          }).catch((err) => {
              console.log(err);
              res.redirect('/');
      
          });
      }
    })
  
    // console.log(username);
    // console.log(req.body.email);
  }

});

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});


//passport authentication middleware that has to be added to routes for restricted access

function authenticationMiddleware() {
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
    //to check if the cookie is still alive and this is done by passport if valid allow to run the next middleware in line
    if(req.isAuthenticated()) {
      return next();
    }
    //else redirect to the register page since it didn't validated
    res.redirect('/');
  }
}

module.exports = router;
