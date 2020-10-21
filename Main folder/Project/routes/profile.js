var express = require('express');
const dao = require('../models/dao.js');
var router = express.Router();


router.get('/', function(req, res, next) {
  let userID = (`${req.session.passport.user}`);
  dao.getUserById(userID)
  .then((user) => {
    let username = user.id;
    let type = user.type;
    dao.getPodcastsByUser(username)
    .then((rows) => {
      res.render('profile', {'username' : username, 'rows' : rows , 'type': type})
    })
    .catch((err) => res.status(500).render('error', {'error' : err, 'message' : 'Podcasts recovery failed'}));
  })
  .catch(err => res.status(500).render('error', {'error' : err,'message' : 'Server error during user information retrieval'}));
});

router.post('/', function(req, res, next) {
  let userID = (`${req.session.passport.user}`);
  let podcastID = req.body.podcastID;
  dao.unfollowPodcast(userID,podcastID)
  .then(()=> {
      res.redirect('/profiles/' + userID);
  })
  .catch((err) => {
    res.status(500).render('error', {'error' : err, 'message' : 'Server Error'});
  })
  
});

module.exports = router;


