var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');

var {mongoose} = require('.././db/mongoose');
// var {Todo} = require('./models/todo');
var {User} = require('.././models/user')
var {authenticate} = require('.././middleware/authenticate')
var {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')


router.post('/admin', (req, res) => {
    var body = _.pick(req.body, ['email', 'password','firstName', 'lastName', 'phoneNo', 'age', 'sex','address', 'role']);
    var user = new User(body);

    user.save().then((user) => {
        return user.generateAuthToken()
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e)
    })
}) 

router.post('/admin/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
            
        })
    }).catch((e) => {
        res.status(400).send();
    })
    
    
})
router.delete('/admin/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
        console.log(user)
    }, () => {
        res.status(400).send();
    })
})
module.exports = router;