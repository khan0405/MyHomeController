/**
 * Created by KHAN on 2015-09-14.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var RemoteAirController = mongoose.model('RemoteAirController');

//var RemoteAirController = require('../models/remoteAirController');

var keyMap = {
    selectMode: 'UN-JEON-SEON-TAEK_',
    sleep: 'JEOL-JEON',
    powerOffSchedule: 'GEO-JIM-YE-YAK_',
    powerCold: 'PA-WEO-NAENG-BANG',
    airControll: 'PUNG-HYANG-SANG-HA',
    powerOn: 'UN-JEON/JEONG-JI_',
    powerOff: 'UN-JEON/JEONG-JI_OFF',
    low: 'LOW_',
    high: 'HIGH_'
};

/* GET home page. */
var defaultSuccessResult = {code:200, message:'success'};

router.get('/currStatus', function(req, res, next) {
    RemoteAirController.findOne({}, function(err, ac) {
        if (handleError(err)) {
            return;
        }
        res.json({
            id: ac._id,
            currTemperature: ac.currTemperature,
            powerOffScheduleMode: ac.powerOffScheduleMode,
            selectMode: ac.selectMode,
            isPowerOn: ac.isPowerOn
        });
        console.log('json write complete');
    });
});

router.route('/status/:id')
    .put(function (req, res) {
        console.log(req.body);
        var ac = {};
        if (req.body.currTemperature) {
            ac['currTemperature'] = req.body.currTemperature
        }
        if (req.body.powerOffScheduleMode) {
            ac['powerOffScheduleMode'] = req.body.powerOffScheduleMode
        }
        if (req.body.selectMode) {
            ac['selectMode'] = req.body.selectMode
        }
        if (req.body.isPowerOn) {
            ac['isPowerOn'] = req.body.isPowerOn
        }
        RemoteAirController.findByIdAndUpdate(req.param.id, ac, function(err, ac) {
            if (handleError(err)) {
                return;
            }
            res.json({
                result:200,
                data:{
                    id: ac._id,
                    currTemperature: ac.currTemperature,
                    powerOffScheduleMode: ac.powerOffScheduleMode,
                    selectMode: ac.selectMode,
                    isPowerOn: ac.isPowerOn
                }
            });
        });
    });

router.route('/selectMode')
    .post(function(req, res) {1
        console.log('temperature post: '+ req.body);
        //var mode = req.body
        //if (mode !== 1 && mode !== 2) {
        //    mode = 1;
        //}

        res.json({data:'put'});
    });

//router.post('/temperature', function(req, res) {
//    console.log('temperature post');
//});

router.post('/cmd/:cmd', function(req, res) {
    res.json({
        request: {
            cmd: req.params.cmd
        },
        code:200,
        message:'success'
    });
});

var handleError = function (err) {
    if (err) {
        res.json({code:500,error:err});
        console.log('get currStatus Error....');
        console.log(err);
        return true;
    }
    return false;
}

module.exports = router;
