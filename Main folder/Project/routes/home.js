var express = require('express');
var router = express.Router();
const dao = require('../models/dao.js');
const querystring = require('querystring');   


router.get('/', function(req, res, next) {
  let username = false;
  let paramURL = false;
  let category = '';
  let param = '';
  let hasCC = false;

  if(req.user) {
     username = req.user.id;
  }

  if(req.url === '/') {
    paramURL = false; //there are not parameters
  }else { //there are parameters
    paramURL = true;
    param = req.query.title;
    category = req.query.category;
  }

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

  if(typeof param == 'undefined') {
    dao.getPodcastFilteredByCategory(category)
    .then((podcasts) => {
      dao.getEpisodeFilteredByCategory(category)
      .then((episodes) => {
        res.render('homepage', {'username' : username, 'podcasts' : podcasts, 'episodes' : episodes, 'hasCC' : hasCC});
      })
      .catch(() => {
        res.render('homepage', {'username' : username, 'podcasts' : podcasts, 'episodes' : false, 'hasCC' : hasCC});
      })
    })
    .catch(() => {
      res.render('homepage', {'username' : username, 'podcasts' : false, 'episodes' : false, 'hasCC' : hasCC});
    })
  }else if(paramURL) { //i've parameters
    if(category === 'all' /*param sono sicuro di averlo*/ ) {
      dao.getPodcastFilteredByParam(param)
      .then((podcasts) => {
          dao.getEpisodesFilteredByParam(param)
          .then((episodes) => {
              res.render('homepage', {'username' : username, 'podcasts' : podcasts, 'episodes' : episodes, 'hasCC' : hasCC});
          })
          .catch(() => {
            res.render('homepage', {'username' : username, 'podcasts' : podcasts, 'episodes' : false, 'hasCC' : hasCC});
          })
      })
      .catch(() => {
        res.render('homepage', {'username' : username, 'podcasts' : false, 'episodes' : false, 'hasCC' : hasCC});
      })

    } else {
      dao.getPodcastFilteredByCategoryAndParam(category, param)
      .then((podcasts) => {
          dao.getEpisodesFilteredByParam(param)
          .then((episodes) => {
            res.render('homepage', {'username' : username, 'podcasts' : podcasts, 'episodes' : episodes, 'hasCC' : hasCC});
          })
          .catch(() => {
            res.render('homepage', {'username' : username, 'podcasts' : podcasts, 'episodes' : false, 'hasCC' : hasCC});
          })
      })
      .catch((err) => {
        res.render('homepage', {'username' : username, 'podcasts' : false, 'episodes' : false, 'hasCC' : hasCC});
      })

    }
  } else { //i've NOT parameters
    /* return all */
    dao.getAllPodcast()
    .then((podcasts) => {
        dao.getAllEpisodes()
        .then((episodes) => {
            res.render('homepage', {'username' : username, 'podcasts' : podcasts, 'episodes' : episodes, 'hasCC' : hasCC});
        })
        .catch(() => {
            res.render('homepage', {'username' : username, 'podcasts' : podcasts, 'episodes' : false, 'hasCC' : hasCC});
        })
    })
    .catch(() => {
      res.render('homepage', {'username' : username, 'podcasts' : false, 'episodes' : false, 'hasCC' : hasCC});
    })
    }
  });

  router.post('/follow', function(req, res, next) {
    let username = req.user.id;
    let podcastID = req.body.podcastID;
    let typeReq = req.body.typeReq;

    if(typeReq === "FOLLOW") {
      //add podcast to follow table
      dao.followPodcast(username,podcastID)
      .then(()=> {
        res.redirect('/profiles/' + username);
      })
      .catch(() => {
        res.redirect('/profiles/' + username);
      })
    }
  
});

router.post('/purchased', function(req, res, next) {
  let username = req.user.id;
  let episodeID = req.body.episodeID;

  dao.addPurchasedEpisode(username, episodeID)
  .then(() => {
    res.redirect('/profiles/' + username + '/episodes');
  })
  .catch(() => {
    res.redirect('/profiles/' + username + '/episodes');
  })
  
});

router.post('/addFavorites', function(req, res, next) {
  let username = req.user.id;
  let episodeID = req.body.episodeID;

  dao.addEpisodeToFavorites(username,episodeID)
  .then(() => {
    res.redirect('/profiles/' + username + '/favouriteEpisodes');
  })
  .catch(() => {
    res.redirect('/profiles/' + username + '/favouriteEpisodes');
  })
});


router.post('/search', function(req, res, next) {
  let typeReq = req.body.typeReq;
  if(typeReq === 'FILTER') {
    let cat = req.body.category;
    URI = querystring.stringify({category: cat}); //Returns 'category=cat'
    res.redirect('/home/?' + URI);
  } else {
    let param = req.body.param;
    URI = querystring.stringify({category: 'all',title: param}); //Returns 'category=all&title=param'
    res.redirect('/home/?' + URI);
  }
});



module.exports = router;
