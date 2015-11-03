/**
 * Created by KHAN on 2015-11-03.
 */

var IRSignalCapture = function(app, lirc) {
    var express = require('express');
    var router = express.Router();
    var common = require('../models/common');

    app.use('/irSignalCapture', router);
};

exports = module.exports = IRSignalCapture;