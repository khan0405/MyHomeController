var express = require('express');
var router = express.Router();

var common = require('../models/common');

var rac = require('../models/remoteAirController');

var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('airController', {title: 'AirController'});
});

var timerknock;

router.get('/tout', function(req, res, next) {
    timerknock = setTimeout(function() {
        console.log('timeout!!!');
        timerknock = undefined;
    }, 5000);
    res.json(common.successResponse());
});
router.get('/tcancel', function(req, res, next) {
    if (timerknock) {
        console.log('cancel timerknock');
        clearTimeout(timerknock);
        timerknock = undefined;
    }
    res.json(common.successResponse());
});
router.get('/status', function (req, res, next) {
    rac.getCurrStatus(function(result) {
        res.json(result);
    });
});

router.post('/status/:cmd', function (req, res, next) {
    var ac = {};
    var cmd = req.params.cmd;
    var updatable = false;
    if (req.body.currTemperature) {
        ac['currTemperature'] = req.body.currTemperature
        updatable = true;
    }
    if (req.body.powerOffScheduleMode) {
        ac['powerOffScheduleMode'] = req.body.powerOffScheduleMode
        updatable = true;
    }
    if (req.body.selectMode) {
        ac['selectMode'] = req.body.selectMode
        updatable = true;
    }
    if (req.body.isPowerOn) {
        ac['isPowerOn'] = req.body.isPowerOn
        updatable = true;
    }
    if (req.body.isPowerHigh) {
        ac['isPowerHigh'] = req.body.isPowerHigh
        updatable = true;
    }

    var responseCallback = function() {
        if (updatable) {
            rac.updateStatus(ac, function(result) {
                res.json(result);
            });
        }
        else {
            res.json(common.successResponse());
        }
    }
    console.log('cmd : ' + cmd);
    //lirc_node.irsend.send_once('lgac', cmd, responseCallback);
    responseCallback();
});

module.exports = router;