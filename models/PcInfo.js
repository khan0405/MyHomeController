/**
 * Created by KHAN on 2015-09-15.
 */
var common = require('./common');
var mongoose = require('mongoose');

// create scheme
var PcInfoSchema = new mongoose.Schema({
    name: String,
    macAddr: String
});

var PcInfoModel = mongoose.model('PcInfo', PcInfoSchema);

function PcInfo () {
    if (!(this instanceof PcInfo)) {
        PcInfo.initialize();
    }
};
PcInfo.initialize = PcInfo.prototype.initialize = function() {
    console.log('initialize PcInfo....');
};

PcInfo.pcInfo = PcInfoModel;
PcInfo.getPcInfoList = function(callback) {
    this.pcInfo.find({}, function(err, pcInfos) {
        var result;
        if (err) {
            result = 'PC Info getting error.';
        }
        else {
            result = [];
            pcInfos.forEach(function (pcInfo) {
                result.push({
                    id: pcInfo._id,
                    name: pcInfo.name,
                    macAddr: pcInfo.macAddr
                });
            });
        }
        if (callback) {
            callback(err, result);
        }
    });
}
PcInfo.getPcInfo = function (pcInfo, callback) {
    if (!pcInfo) {
        if (callback) {
            callback(common.successResponse({}));
        }
        return;
    }
    var findParam = {};
    if (pcInfo.id) {
        findParam['_id'] = pcInfo.id;
    }
    if (pcInfo.name) {
        findParam['name'] = pcInfo.name;
    }
    if (pcInfo.macAddr) {
        findParam['macAddr'] = pcInfo.macAddr;
    }
    if (Object.keys(findParam).length == 0) {
        if (callback) {
            callback(common.successResponse({}));
        }
        return;
    }
    this.pcInfo.findOne(findParam, function (err, pcInfo) {
        var result;
        if (err) {
            console.log(err);
            result = {};
        }
        else {
            result = pcInfo ? {
                id: pcInfo._id,
                name: pcInfo.name,
                macAddr: pcInfo.macAddr
            } : {};
        }

        if (callback) {
            callback(common.successResponse(result));
        }
    });
}
PcInfo.insertPcInfo = function (pcInfo, callback) {
    if (!pcInfo) {
        if (callback) {
            callback(common.errorResponse('require find PC info param'));
        }
        return;
    }
    PcInfo.getPcInfo({name: pcInfo.name}, function(result) {
        if (result && result.name && result.name === pcInfo.name) {
            if (callback) {
                callback(common.errorResponseWithCode(400, 'duplicate pc name'));
            }
        }
        else {
            var info = new PcInfoModel(pcInfo);
            info.save(function (err) {
                if (err) {
                    console.log(err);
                    result = common.errorResponse('pc info saving error...');
                }
                else {
                    result = common.successResponse(pcInfo);
                }
                console.log('create Pc Info: ' + pcInfo);
            });
            if (callback) {
                callback(result);
            }
        }
    });

}
PcInfo.updatePcInfo = function (pcInfo, callback) {
    console.log(pcInfo);
    console.log(this.pcInfo.update);
    console.log(PcInfo.update);
    this.pcInfo.update({_id: pcInfo.id}, pcInfo, function(err, numAffected) {
        var result;
        if (err) {
            result = common.errorResponse('PC Info update error.', err);
            callback(result);
        }
        else {
            if (callback) {
                PcInfo.getPcInfo({id: pcInfo.id}, callback);
            }
        }
    });
}

PcInfo.removePcInfo = function(pcInfo, callback) {
    this.pcInfo.find({_id: pcInfo.id}).remove(function(err, info) {
        var result;
        if (err) {
            result = common.errorResponse('PC Info remove error.', err);
        }
        else {
            result = common.successResponse({id: info._id});
        }
        if (callback) {
            callback(result);
        }
    });
}
module.exports = PcInfo;