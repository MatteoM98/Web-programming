var express = require('express');
const dao = require('../models/dao.js');
var router = express.Router();

router.get('/', function(req, res, next) {
    let userID = (`${req.session.passport.user}`);
    dao.getUserById(userID)
    .then((user) => {
        let username = user.id;
        let userType = user.type;
        dao.getCCByUser(username)
        .then((cc) => {
            res.render('profileCreditCard', {'username': userID, 'userType' : userType, 'content' : true, 'owner' : userID, 'name' : cc.Name, 
            'surname' : cc.Surname, 'number' : cc.Number, 'type' : cc.Type, 'expireDate' : cc.ExpireDate, 'ccv' : cc.CCV,
            'message': '', 'messageType' : ''});
        })
        .catch((err) => res.render('profileCreditCard', {'username' : userID, 'userType': userType, 'message': '', 'messageType' : '', 'content': false}))
    })
    .catch(err => res.send(err));
  });

/* POST */
router.post('/', function(req, res, next) {
    let owner = (`${req.session.passport.user}`);
    let name = req.body.name;
    let surname = req.body.surname;
    let cardNumber = req.body.cardNumber;
    let cardType = req.body.cardType;
    let cardExpireDate = req.body.cardExpireDate;
    let cardCCV = req.body.cardCCV;
    dao.getUserById(owner)
    .then((user) => {
        const type = user.Type;
        dao.createNewCC(cardNumber,owner,cardType,cardCCV,cardExpireDate,name,surname)
        .then(() => {
            let str = 'Information registered successfully!';
            return res.render('profileCreditCard', {'username': owner, 'userType' : type,'message' : str, 'messageType' : 'success', 
                              'content' : 'full', 'owner' : owner, 'name' : name, 'surname' : surname, 'number' : cardNumber, 
                              'type' : cardType, 'expireDate' : cardExpireDate, 'ccv' : cardCCV});
        }).catch((err) => {
            let str = 'Error';
            return res.render('profileCreditCard', {'username' : owner, 'userType': 'Auditor', 'message': str, 'messageType' : 'danger', 'content': ''});
        })
    })
    .catch(()=> {
        res.status(500).render('error', {'error' : err,'message' : 'Server error during user information retrieval'});
    })
});

module.exports = router;