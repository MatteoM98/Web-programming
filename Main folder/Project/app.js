"use strict;"

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const moment = require('moment');
const dao = require('./models/dao.js');


var sessionRouter = require('./routes/sessions');
var profileRouter = require('./routes/profile');
var userEpisodeRouter = require('./routes/profileEpisode');
var userCreditCardRouter = require('./routes/profileCreditCard');
var userFavEpisodeRouter = require('./routes/profileFavEpisode');
var userCreatePodcast = require('./routes/createPodcast');
var userCreateEpisode = require('./routes/createEpisode');
var userCreatedPodcast = require('./routes/createdPodcasts');
var userCreatedEpisode = require('./routes/createdEpisodes');
var homeRouter = require('./routes/home');
var homePodRouter = require('./routes/homePodcasts');
var homeEpRouter = require('./routes/homeEpisodes');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport configuration
passport.use(new LocalStrategy(
  function(username, password, done) {
    dao.getUser(username, password).then(({user, check}) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username. If you are not registered click on Sign up button' });
      }
      if (!check) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    }).catch(()=> console.log('Error'));
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  dao.getUserById(id).then(user => {
    done(null, user);
  });
});

// set up the session
app.use(session({
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
  }
  else
    res.redirect('/');
}

//routes (dal più specifico al meno specifico)
app.use('/profiles/*/episodes', isLoggedIn, userEpisodeRouter);
app.use('/profiles/*/newPodcast',isLoggedIn, userCreatePodcast);
app.use('/profiles/*/newEpisode',isLoggedIn, userCreateEpisode);
app.use('/profiles/*/favouriteEpisodes', isLoggedIn, userFavEpisodeRouter);
app.use('/profiles/*/creditcard', isLoggedIn, userCreditCardRouter);
app.use('/profiles/*/mypodcasts', isLoggedIn, userCreatedPodcast);
app.use('/profiles/*/myepisodes', isLoggedIn, userCreatedEpisode);
app.use('/profiles/*', isLoggedIn, profileRouter);
app.use('/home',homeRouter);
app.use('/home/podcasts',homePodRouter);
app.use('/home/episodes',homeEpRouter);
app.use('/', sessionRouter);


// define default variables for the views
app.use(function (req, res, next) {
  app.locals.moment = moment;
  app.locals.message = '';
  next();
});

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
