var express = require('express');
const dao = require('../models/dao.js');
const { resolveInclude } = require('ejs');
var router = express.Router();


router.get('/', function(req, res, next) {
  let userID = (`${req.session.passport.user}`);
  dao.getEpisodeAndPodcastFromUser(userID)
  .then((obj) => {
    if(obj)
      return res.render('profileEpisode', { 'array' : obj.array, 'username' : obj.username, 'type': obj.type, 'length': obj.length});
    else 
      return res.render('profileEpisode', { 'array' : null, 'username' : userID, 'type': obj.type, 'length': null});
  })
  .catch((err) => res.status(500).render('error', {'error' : err,'message' : 'Server error during episode and podcast information retrieval'}));
});

module.exports = router;