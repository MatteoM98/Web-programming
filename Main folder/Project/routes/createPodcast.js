var express = require('express');
const multer = require('multer');
var fs = require('fs');
const upload = multer({dest: __dirname + '/../public/images'});
const path = require('path');
const dao = require('../models/dao.js');
var router = express.Router();

router.get('/', function(req, res, next) { 
    let userID = (`${req.session.passport.user}`);
    dao.getUserById(userID)
    .then((user) => {
        let username = user.id;
        let type = user.type;
        dao.getFreeEpisodes()
        .then((rows) => {
          res.render('createPodcast', {'username' : username, 'type' : type, 'message': '', 'messageType' : '', 'rows' : rows});
        })
        .catch(() => {
          res.render('createPodcast', {'username' : username, 'type' : type, 'message': '', 'messageType' : '', 'rows' : false});
        })
    })
    .catch(err => res.status(500).render('error', {'error' : err,'message' : 'Server error during user information retrieval'}));
});


/* POST */
router.post('/', upload.single('image'), function(req, res, next) { 
  let userID = (`${req.session.passport.user}`);
  let title = req.body.title;
  let author = req.body.author;
  let description = req.body.description;
  let category = req.body.category;
  let episodes;
  if(req.body.episodes === '-') {
    episodes = false;
  }else {
    episodes = req.body.episodes;
  }
  let imageName = '';
  let IDsEpisode = [];
  //get ID of episodes
  if(episodes && Array.isArray(episodes)) {
    for (let ep of episodes) {
      let id = ep.charAt(0);
      IDsEpisode.push(id);
    }
  } else {
    IDsEpisode.push(episodes[0]);
  }

  try {
    if(req.file) {
      imageName = req.file.originalname;
      //rename file with original name
      fs.renameSync( __dirname + '/../public/images/' + req.file.filename, __dirname + '/../public/images/' + imageName);
    }
  }catch{
    res.status(500).render('error', {'error' : err,'message' : 'Server error while saving the file'});
  }

  //file was renamed successfully
  dao.getUserById(userID)
    .then((user) => {
        let type = user.type;
        dao.createNewPodcastWithParam(title,description,category,imageName,author)
        .then((IDpodcast) => {
            if(episodes) {
            dao.addEpisodesToPodcast(IDsEpisode,IDpodcast)
            .then(() => {
              res.render('createPodcast', {'username' : userID, 'type' : type, 'message': 'DB updated', 'messageType' : 'success', 'rows': false});
            })
            .catch(() => {
              res.render('createPodcast', {'username' : userID, 'type' : type, 'message': 'Error DB updating', 'messageType' : 'danger', 'rows': false});
            })
            res.render('createPodcast', {'username' : userID, 'type' : type, 'message': 'DB updated', 'messageType' : 'success', 'rows': false});
          }
          res.render('createPodcast', {'username' : userID, 'type' : type, 'message': 'DB updated', 'messageType' : 'success', 'rows': false});
        })
        .catch(err => res.status(500).render('error', {'error' : err,'message' : 'Server error during podcast creation'}));
    })
    .catch(err => res.status(500).render('error', {'error' : err,'message' : 'Server error during user information retrieval'}));
});

module.exports = router;

