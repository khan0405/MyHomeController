var express = require('express');
var router = express.Router();
var common = require('../models/common');
var pcInfo = require('../models/PcInfo');
var wol = require('wake_on_lan');

var PcController = function (app) {
    app.use('/pcController', router);

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('pcController', {title: 'My PC Controller'});
    });

    router.get('/list', function(req, res, next) {
       pcInfo.getPcInfoList(function(result) {
           res.json(result);
       });
    });

    router.post('/create', function(req, res, next) {
        var data = req.body;
        if (!data) {
            res.json(common.errorResponse('require pc info data', ''));
            return;
        }
        pcInfo.insertPcInfo(data, function(result) {
            res.json(result);
        });

    });

    router.post('/powerOn', function(req, res, next) {
        var data = req.body;
        if (!data || data.macAddr) {
            res.json(common.errorResponse('require pc info data'));
            return;
        }
        wol.wake(data.macAddr, function (err) {
            if (err) {
                res.json(common.errorResponseWithCode(500, 'On error occured power on....', err));
                return;
            }
            res.json(common.successResponse(null));
        });

    });
}

exports = module.exports = PcController;