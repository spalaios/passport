const express = require('express');
const router = express.Router();
//import passport module
const passport = require('passport');


// router.get('/',authenticationMiddleware(), (req, res, next) => {
//     req.logout();
//     req.session.destroy();
//     res.redirect('/');
// });

router.get('/',authenticationMiddleware(), (req, res, next) => {
    req.logout()
    req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
})﻿




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