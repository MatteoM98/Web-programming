var express = require('express');
const dao = require('../models/dao.js');
var router = express.Router();


router.get('/', function(req, res, next) { 
    let userID = (`${req.session.passport.user}`);
    dao.getUserById(userID)
    .then((user)=> {
        let type = user.type;
        dao.getEpisodesByAuthor(userID)
        .then((rows)=> {
            dao.getPodcastCreatedBy(userID)
            .then((podcasts)=> {
                res.render('createdEpisodes', {'username' : userID, 'type' : type, 'rows' : rows, 'podcasts' : podcasts});
            })
            .catch(()=> {
                res.render('createdEpisodes', {'username' : userID, 'type' : type, 'rows' : rows, 'podcasts' : false});
            })
        })
        .catch(()=> {
            res.render('createdEpisodes', {'username' : userID, 'type' : type, 'rows' : false});
        })
    })
    .catch(()=> {
        res.status(500).render('error', {'error' : err,'message' : 'Server error during user information retrieval'})
    })
});

router.post('/', function (req, res, next) {
    let userID = (`${req.session.passport.user}`);
    let episodeID = req.body.episodeID;
    let typeReq = req.body.typeReq;
    if(typeReq === 'DELETE') {
            //delete the episode and delete it from isPartOf
            dao.deleteEpisode(episodeID)
            .then(()=> {
                //reload the page
                res.redirect('/profiles/' + userID + '/myepisodes');
            })
            .catch(() => {
                //deletion did not take place
                res.send('error');
            })
    }else if (typeReq === 'PUT') {
      let title = req.body.title;
      let description = req.body.description;
      let date = req.body.date;
      let price = req.body.price;
      let sponsor = req.body.sponsor;
      let podcast = req.body.podcast;
      let boolPod = false;
      let podID = -1;
      
      //get podcast ID
      if(podcast !== '-') {
          let arr = podcast.split('.');
          podID = arr[0];
          boolPod = true;
      }

     //edit episode
     dao.modifyEpisode(episodeID,title,description,date,price,sponsor)
     .then(()=> {
        //modify isPartOf
        if(boolPod) {
            dao.modifyIsPartOf(episodeID,podID)
            .then(() => {
                res.redirect('/profiles/' + userID + '/myepisodes');
            })
            .catch(() => {
                res.status(500).render('error', {'error' : err,'message' : 'Impossible modify DB\'s table'});
            })
        }
        res.redirect('/profiles/' + userID + '/myepisodes');
     })
     .catch((err)=> {
        res.status(500).render('error', {'error' : err,'message' : 'Impossible modify Episode table'});
     })

    }else {
       res.send('error');
    }
});

module.exports = router;


