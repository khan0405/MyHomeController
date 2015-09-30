var express = require('express');
var router = express.Router();

var common = require('../models/common');

exports = module.exports = tv;

function tv(app, lirc) {
    app.use('/tv/', router);

    router.get('/', function (req, res) {
        res.render('tv', {title: 'TV'});
    });
}