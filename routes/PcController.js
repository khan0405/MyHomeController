var express = require('express');
var router = express.Router();
var common = require('../models/common');
var pcInfo = require('../models/PcInfo');
var wol = require('wake_on_lan');

var PcController = function (app) {
    app.use('/pcController', router);

    /* GET home page. */
    router.get('/', function(req, res, next) {
        pcInfo.getPcInfoList(function(err, result) {
            common.render(req, res, 'PcController', {
                title: 'My PC Controller',
                pcList: result
            });
        });
    });

    router.get('/list', function(req, res, next) {
       pcInfo.getPcInfoList(function(err, result) {
           if (err) {
               common.sendErrorJson(res, common.errorResponse('getting pc info list error', err));
           }
           else {
               result = common.successResponse(result);
           }
           res.json(result);
       });
    });

    router.post('/create', function(req, res, next) {
        var data = req.body;
        if (!data) {
            common.sendErrorJson(res, common.errorResponse('require pc info data', ''));
            return;
        }
        pcInfo.insertPcInfo(data, function(result) {
            res.json(result);
        });

    });

    router.post('/update', function(req, res, next) {
        var data = req.body;
        if (!data) {
            common.sendErrorJson(res, common.errorResponse('require pc info data', ''));
            return;
        }
        pcInfo.updatePcInfo(data, function(result) {
            res.json(result);
        });
    });

    router.post('/remove', function(req, res, next) {
        var data = req.body;
        if (!data) {
            common.sendErrorJson(res, common.errorResponse('require pc info data', ''));
            return;
        }
        pcInfo.removePcInfo(data, function(result) {
            res.json(result);
        });
    });
    router.get('/error', function(req, res, next) {
        common.sendErrorJson(res, common.errorResponse('error!!', 'error...'));
    });
    router.post('/powerOn', function(req, res, next) {
        var data = req.body;
        if (!data || !data.macAddr) {
            common.sendErrorJson(res, common.errorResponse('require pc info data', ''));
            return;
        }
        wol.wake(data.macAddr, function (err) {
            if (err) {
                common.sendErrorJson(res, common.errorResponse('PC를 켜는 데 실패했습니다.', err));
                return;
            }
            res.json(common.successResponse(undefined, 'PC 켜기 신호를 보냈습니다.'));
        });

    });
};

exports = module.exports = PcController;
