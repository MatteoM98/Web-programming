var express = require('express');
const dao = require('../models/dao.js');
var router = express.Router();

router.get('/', function(req, res, next) { 
    let userID = (`${req.session.passport.user}`);
    dao.getUserById(userID)
    .then((user)=> {
        let type = user.type;
        dao.getPodcastCreatedBy(userID)
        .then((rows)=> {
            res.render('createdPodcasts', {'username' : userID, 'type': type, 'message' : '', 'messageType' : '', 'rows': rows});
        })
        .catch(()=> {
            res.render('createdPodcasts', {'username' : userID, 'type': type, 'message' : '', 'messageType' : '', 'rows': false});
        })
    })
    .catch(()=> {
        res.status(500).render('error', {'error' : err,'message' : 'Server error during user information retrieval'});
    })
});

router.post('/', function(req, res, next) {  //it would be DELETE but it is not supported by HTML forms
    let userID = (`${req.session.passport.user}`);
    let podID = req.body.podID;
    let typeReq = req.body.typeReq;
    if(typeReq === 'DELETE') {
        dao.deletePodcast(podID)
        .then(() => {
            dao.getUserById(userID)
            .then((user)=> {
                let type = user.type;
                dao.getPodcastCreatedBy(userID)
                .then((rows)=> {
                    res.render('createdPodcasts', {'username' : userID, 'type': type, 'message' : 'Podcast eliminated successfully', 'messageType' : 'success', 'rows': rows});
                })
                .catch(()=> {
                    res.render('createdPodcasts', {'username' : userID, 'type': type, 'message' : '', 'messageType' : '', 'rows': false});
                })
            })
            .catch(()=> {
                res.status(500).render('error', {'error' : err,'message' : 'Server error during user information retrieval'});
            })
        })
        .catch((err) => {
            res.status(500).render('error', {'error' : err,'message' : 'Impossible delete podcast'});
        })
    } else if (typeReq === 'PUT') { //modify a podcast
        let title = req.body.title;
        let des = req.body.description;
        let cat = req.body.category;
        let id = req.body.podID;
        dao.modifyPodcast(id,title,des,cat)
        .then(() => {
            dao.getUserById(userID)
            .then((user)=> {
                let type = user.type;
                dao.getPodcastCreatedBy(userID)
                .then((rows)=> {
                    res.render('createdPodcasts', {'username' : userID, 'type': type, 'message' : 'Podcast changed successfully', 'messageType' : 'success', 'rows': rows});
                })
                .catch(()=> {
                    res.render('createdPodcasts', {'username' : userID, 'type': type, 'message' : '', 'messageType' : '', 'rows': false});
                })
            })
            .catch(()=> {
                res.status(500).render('error', {'error' : err,'message' : 'Server error during user information retrieval'});
            })
        })
        .catch((err) => {
            res.status(500).render('error', {'error' : err,'message' : 'Impossible modify podcast'});
        })
    }else {
        res.send('error');
    }
});

module.exports = router;


