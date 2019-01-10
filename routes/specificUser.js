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


router.get('/admin/me', authenticate, (req, res) => {
    res.send(req.user);
})

module.exports = router;