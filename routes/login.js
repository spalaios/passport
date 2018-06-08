const express = require('express');
const router = express.Router();
//import passport module
const passport = require('passport');

/* GET users listing. */
router.get('/',authenticationMiddleware(), function(req, res, next) {
  // console.log(req.user);
  //   console.log(req.isAuthenticated());
  res.render('login');
});

//post request for login

router.post('/data',passport.authenticate('local', {
  successRedirect : '/profile',
  failureRedirect : '/login'
}));


//passport authentication middleware that has to be added to routes for restricted access

function authenticationMiddleware() {
  return (req, res, next) => {
    // console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
    //to check if the cookie is still alive and this is done by passport if valid allow to run the next middleware in line
    if(req.isAuthenticated()) {
      return next();
    }
    //else redirect to the register page since it didn't validated
    console.log('cookie not available so you are not allowed to access restricted resources');
    res.redirect('/');
  }
}

module.exports = router;