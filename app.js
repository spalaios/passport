var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);
const User = require('./models/passUserModel');
const bcrypt = require('bcrypt');
//connect to the database

mongoose.connect('mongodb://localhost:27017/passport');

var indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const profileRouter = require('./routes/profile');
const logoutRouter = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      // console.log('param '+param);
      var namespace = param.split('.')
      var root    = namespace.shift()
      var formParam = root;
    
      //here namespace is an array so it will run only once or twice or the numbers of errors found
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));



//sesssion middleware

// resave is false bcoz we dont want the session to be resaved if no changes is there in current session hence will save memory 

//saveUnitialized to false bcoz we want to creates cookies only when the user logged in usally if true will create cookie even if the user is just visiting a website or not logged in


app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false,
  store : new MongoStore({mongooseConnection : mongoose.connection })
}));

//since passport is dependent on session so it should be placed after session middleware
app.use(passport.initialize());
app.use(passport.session());



app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/logout', logoutRouter);

//passport local strategy since we mentioned in our login post request and yes it is also below are routes
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username);
    console.log(password);
    // User.findOne({ username: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
    User.findOne({username : username})
        .exec()
        .then((user) => {
            //verify user with username and password and then allow access

            if(user) {
              console.log('found user for local strategy ', user);
            return done(null, user, {message : 'seeing user vvalu for testing'});
            } else {
              console.log('failed due to no user found from db');
              return done(null, false, {message : 'seeing user vvalu for testing'});
            }
          
        })
        .catch((error) => {
          // return done(null, false, {message : 'failed to fetch from  database'});
          return done(err);
        })
  }
));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
