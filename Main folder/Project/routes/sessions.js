
'use strict';

const express = require('express');
const querystring = require('querystring');   
const router = express.Router();
const passport = require('passport');
const dao = require('../models/dao.js');

// Login page
router.get('/', function(req, res, next) {
  res.render('index', {'message': ''});
});

router.get('/home', function(req, res, next) {
  res.render('homepage');
});

/* Do the login */
router.post('/sessions', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
        // display wrong login messages
        return res.render('index', {'message': info.message, 'type': 'danger'});
    }
    // success, perform the login
    req.login(user, function(err) {
      if (err) { return next(err); }
      // req.user contains the authenticated user
      res.redirect('/profiles/' + user.id);
    });
  })(req, res, next);
});

/* DO sign up */
router.post('/', function(req, res) {
    let email = req.body.username;
    let password = req.body.password;
    dao.createUser(email, password).then(username => {
        let str = 'Congratulation! This is your username:    ' + username;
        return res.render('index', { 'message' : str, 'type' : 'success'});
    }).catch(() => {
        let str = 'Error';
        return res.render('index', { 'message' : str, 'type' : 'danger'});
    })
  });

  /* Search */
  router.post('/home', function(req, res) {
    let cat = req.body.category;
    let query = req.body.query;
    let URI;
    if(cat === "None" || cat === "Select a category ") {
      URI = querystring.stringify({category: 'all', title: query}); //Returns 'category=all&title=NomeTitolo'
    }else URI = querystring.stringify({ category: cat ,  title: query}); //Returns 'category=NomeCategoria&title=NomeTitolo'
    res.redirect('/home/?' + URI);
  });

  /* Logout */
router.get('/sessions/current', function(req, res, next) {
  console.log(req.isAuthenticated()); //true
  req.logout();
  console.log(req.isAuthenticated()); //false
  res.redirect('/');
});

  
module.exports = router;