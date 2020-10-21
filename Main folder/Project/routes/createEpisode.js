var express = require('express');
const multer = require('multer');
var fs = require('fs');
const upload = multer({dest: __dirname + '/../public/audio'});
const path = require('path');
const dao = require('../models/dao.js');
var router = express.Router();

router.get('/', function(req, res, next) { 
    let userID = (`${req.session.passport.user}`);
    dao.getUserById(userID)
    .then((user) => {
        let username = user.id;
        let type = user.type;
        dao.getAllPodcast()
        .then((rows)=> {
            res.render('createEpisode', {'username' : username, 'type' : type, 'message': '', 'messageType' : '', 'rows' : rows});
        })
        .catch(()=> {
            res.render('createEpisode', {'username' : username, 'type' : type, 'message': '', 'messageType' : '', 'rows' : false});
        })
    })
    .catch(err => res.send(err));
});


/* POST */
router.post('/', upload.single('audio'), function(req, res, next) { 
    let userID = (`${req.session.passport.user}`);
    let title = req.body.title;
    let author = req.body.author;
    let description = req.body.description;
    let date = req.body.date;
    let price = req.body.price;
    let podcast = req.body.podcast;
    let sponsor = req.body.sponsor;
    let podcastID = 0;
    let audioName = '';
    let podcastBool = false;
    //set sponsor = null if is blank
    if(sponsor === '') {
        sponsor = null;
    }
    //separate podcast's ID from title
    if(podcast !== '-') {
        podcastBool = true;
        let array = podcast.split('.');
        podcastID = array[0];
    } 

    //rename file
    try {
        if(req.file) {
          audioName = req.file.originalname;
          //rename file with original name
          fs.renameSync( __dirname + '/../public/audio/' + req.file.filename, __dirname + '/../public/audio/' + audioName);
        }
      }catch{
         res.send('error');
      }
    
    //create episode
    dao.getUserById(userID)
    .then((user)=> {
        let type = user.type;
        dao.createNewEpisode(title,description,date,audioName,price,sponsor,author)
        .then((episodeID) => {
            if(!podcastBool)
                res.render('createEpisode', {'username' : userID, 'type' : type, 'message': 'Episode created successfully', 'messageType' : 'success', 'rows' : false});
            else {
                dao.addOneEpisodeToPodcast(episodeID,podcastID)
                .then(()=> {
                    res.render('createEpisode', {'username' : userID, 'type' : type, 'message': 'Episode created successfully', 'messageType' : 'success', 'rows' : false});
                })
                .catch(() => {
                    res.render('createEpisode', {'username' : userID, 'type' : type, 'message': 'Error', 'messageType' : 'danger', 'rows' : false});
                })
            }
        })
        .catch(()=> {
            res.render('createEpisode', {'username' : userID, 'type' : type, 'message': 'Error', 'messageType' : 'danger', 'rows' : false});
        })
    })
    .catch(()=> {
        res.send('error');
    })


});

module.exports = router;

