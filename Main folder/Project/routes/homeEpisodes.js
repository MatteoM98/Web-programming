var express = require('express');
var router = express.Router();
const dao = require('../models/dao.js');
const querystring = require('querystring');   
const { ESPIPE } = require('constants');


router.get('/', function(req, res, next) {
  let username = false;
  let category = '';
  let param = '';

  if(req.user) {
     username = req.user.id;
  }

   param = req.query.title;
   category = req.query.category;

async function asyncCall() {
    let hasCC = await dao.hasUserCC(username);
    if(typeof hasCC != 'undefined') {
        hasCC = true;
    }
    if(typeof param == 'undefined' && typeof category != 'undefined') {
        dao.getEpisodeFilteredByCategory(category)
        .then((episodes) => {
            res.render('homepageEpisodes', {'username' : username, 'episodes' : episodes, 'hasCC' : hasCC});
        })
        .catch(() => {
            res.render('homepageEpisodes', {'username' : username, 'episodes' : false, 'hasCC' : hasCC});
        })
    }else if(typeof param != 'undefined' && typeof category != 'undefined') { //i've parameters
        if(category === 'all' /*param sono sicuro di averlo*/ ) {
            dao.getEpisodesFilteredByParam(param)
            .then((episodes) => {
                res.render('homepageEpisodes', {'username' : username, 'episodes' : episodes, 'hasCC' : hasCC});
            })
            .catch(() => {
                res.render('homepageEpisodes', {'username' : username, 'episodes' : false, 'hasCC' : hasCC});
            })
        } 
    } else { //i've NOT parameters
            dao.getAllEpisodes()
            .then((episodes) => {
                res.render('homepageEpisodes', {'username' : username, 'episodes' : episodes, 'hasCC' : hasCC});
            })
            .catch(() => {
                res.render('homepageEpisodes', {'username' : username, 'episodes' : false, 'hasCC' : hasCC});
            })
        }
}

asyncCall();

});

router.post('/search', function(req, res, next) {
    let typeReq = req.body.typeReq;
    if(typeReq === 'FILTER') {
      let cat = req.body.category;
      URI = querystring.stringify({category: cat}); //Returns 'category=cat'
      res.redirect('/home/episodes/?' + URI);
    } else {
      let param = req.body.param;
      URI = querystring.stringify({category: 'all',title: param}); //Returns 'category=all&title=param'
      res.redirect('/home/episodes/?' + URI);
    }
});


router.get('/:id',function (req, res, next) {
    let username = false;

    if(req.user) {
        username = req.user.id;
    }
    const episodeID = req.params.id;

    let hasCC = false;
    
    if(username) {
        dao.hasUserCC(username)
        .then((CC) => {
            if(typeof CC != 'undefined') {
                hasCC = true;
            }
            dao.getEpisodeInfo(episodeID)
            .then((episodeInfo) => {
                dao.getCommentsOfEpisode(episodeID)
                .then((comments)=> {
                    res.render('singleEpisode', {'username' : username, 'episodeInfo' : episodeInfo, 'comments' :  comments, 'hasCC' : hasCC});
                })
                .catch((err) => {
                    res.render('singleEpisode', {'username' : username, 'episodeInfo' : episodeInfo, 'comments' :  false, 'hasCC' : hasCC});
                })
            })
            .catch((err) => {
                res.status(500).render('error',{'error': err, 'message' : 'Impossible get episode info'});
            })
        })
        .catch(() => {
            res.status(500).render('error',{'error': err, 'message' : 'Generic Error'});
        })
    } else {

        dao.getEpisodeInfo(episodeID)
        .then((episodeInfo) => {
            dao.getCommentsOfEpisode(episodeID)
            .then((comments)=> {
                res.render('singleEpisode', {'username' : username, 'episodeInfo' : episodeInfo, 'comments' :  comments, 'hasCC' : hasCC});
            })
            .catch((err) => {
                res.render('singleEpisode', {'username' : username, 'episodeInfo' : episodeInfo, 'comments' :  false, 'hasCC' : hasCC});
            })
        })
        .catch((err) => {
            res.status(500).render('error',{'error': err, 'message' : 'Impossible get episode info'});
        })
    }
});

router.post('/:id/createComment',function (req, res, next) {
    let user = req.user.id;
    let comment = req.body.comment;
    let episodeID = req.body.episodeID;

    dao.createNewComment(user,episodeID,comment)
    .then(() => {
        res.redirect('/home/episodes/' + episodeID);
    })
    .catch((err) => {
        res.render('error',{'error': err, 'message' : 'Impossible create new comment'});
    })
});

router.post('/:id/deleteComment',function (req, res, next) {
    const commentID = req.body.commentID;
    const episodeID = req.body.episodeID;

    dao.deleteComment(commentID)
    .then(() => {
          res.redirect('/home/episodes/' + episodeID);
    })
    .catch((err)=> {
        res.render('error',{'error': err, 'message' : 'Impossible delete comment'});
    })
});

router.post('/:id/modifyComment',function (req, res, next) {
    const commentID = req.body.commentID;
    const episodeID = req.body.episodeID;
    const comment = req.body.comment;

    dao.modifyComment(commentID, comment)
    .then(() => {
          res.redirect('/home/episodes/' + episodeID);
    })
    .catch((err)=> {
        res.render('error',{'error': err, 'message' : 'Impossible modify comment'});
    })
});

module.exports = router;
