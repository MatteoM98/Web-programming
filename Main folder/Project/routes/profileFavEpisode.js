var express = require('express');
const dao = require('../models/dao.js');
var router = express.Router();

router.get('/', function(req, res, next) {
    let userID = (`${req.session.passport.user}`);
    dao.getUserById(userID)
    .then((user) => {
        let username = user.id;
        let userType = user.type;
        dao.getFavouriteEpisodes(username)
        .then((rows)=> {
            res.render('profileFavEpisode', {'username' : username, 'type' : userType, 'rows' : rows});
        }).catch((err)=> {
            res.status(500).render('error', {'error' : err,'message' : 'Server error during favourite episodes retrieval'});
        });
    }).catch(err => res.status(500).render('error', {'error' : err,'message' : 'Server error during user information retrieval'}));
});

router.post('/', function(req, res, next) {
    let userID = (`${req.session.passport.user}`);
    let episodeID = req.body.episodeID;
    dao.removeEpisodeFromFavorites(userID,episodeID)
    .then(()=> {
        res.redirect('/profiles/' + userID + '/favouriteEpisodes');
    })
    .catch((err)=> {
        res.status(500).render('error', {'error' : err,'message' : 'Impossible remove episode from favorites'});
    })
});


module.exports = router;