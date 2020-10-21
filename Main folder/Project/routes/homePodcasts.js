var express = require('express');
var router = express.Router();
const dao = require('../models/dao.js');
const querystring = require('querystring');   


router.get('/', function(req, res, next) {
    let username = false;
    let category = '';
    let param = '';
    let hasCC = false;
  
    if(req.user) {
       username = req.user.id;
    }
  
    param = req.query.title;
    category = req.query.category;
  
    if(username) { //if is a registered user
      dao.hasUserCC(username)
      .then((res) => {
        if(typeof res == 'undefined') {
          hasCC = false;
        } else {
          hasCC = true;
        }
      })
      .catch(() => {
        res.send('error');
      })
    }
  
    if(typeof param == 'undefined' && typeof category != 'undefined') {
      dao.getPodcastFilteredByCategory(category)
      .then((podcasts) => {
          res.render('homepagePodcasts', {'username' : username, 'podcasts' : podcasts, 'hasCC' : hasCC});
      })
      .catch(() => {
        res.render('homepagePodcasts', {'username' : username, 'podcasts' : false, 'hasCC' : hasCC});
      })
    }else if(typeof param != 'undefined' && typeof category != 'undefined'){ //i've parameters
      if(category === 'all' /*param sono sicuro di averlo*/ ) {
        dao.getPodcastFilteredByParam(param)
        .then((podcasts) => {
                res.render('homepagePodcasts', {'username' : username, 'podcasts' : podcasts, 'hasCC' : hasCC});
        })
        .catch(() => {
          res.render('homepagePodcasts', {'username' : username, 'podcasts' : false, 'hasCC' : hasCC});
        })
  
      } else {
        dao.getPodcastFilteredByCategoryAndParam(category, param)
        .then((podcasts) => {
              res.render('homepagePodcasts', {'username' : username, 'podcasts' : podcasts, 'hasCC' : hasCC});
        })
        .catch((err) => {
          res.render('homepagePodcasts', {'username' : username, 'podcasts' : false, 'hasCC' : hasCC});
        })
      }
    } else { //i've NOT parameters
      /* return all */
      dao.getAllPodcast()
      .then((podcasts) => {
              res.render('homepagePodcasts', {'username' : username, 'podcasts' : podcasts, 'hasCC' : hasCC});
        })
      .catch(() => {
        res.render('homepagePodcasts', {'username' : username, 'podcasts' : false, 'episodes' : false, 'hasCC' : hasCC});
      })
    }
});

router.post('/search', function(req, res, next) {
    let typeReq = req.body.typeReq;
    if(typeReq === 'FILTER') {
      let cat = req.body.category;
      URI = querystring.stringify({category: cat}); //Returns 'category=cat'
      res.redirect('/home/podcasts/?' + URI);
    } else {
      let param = req.body.param;
      URI = querystring.stringify({category: 'all',title: param}); //Returns 'category=all&title=param'
      res.redirect('/home/podcasts/?' + URI);
    }
});
  

module.exports = router;