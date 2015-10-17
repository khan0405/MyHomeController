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
            result = common.errorResponse('PC Info getting error.', err);
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
            callback(result);
        }
    });
}
PcInfo.getPcInfo = function (pcInfo, callback) {
    if (!pcInfo) {
        if (callback) {
            callback({});
        }
        return;
    }
    var findParam = {};
    console.log(JSON.stringify(pcInfo));
    if (pcInfo.id) {
        findParam['_id'] = pcInfo.id;
    }
    if (pcInfo.name) {
        findParam['name'] = pcInfo.name;
    }
    if (pcInfo.macAddr) {
        findParam['macAddr'] = pcInfo.macAddr;
    }
    console.log("findParam: ");
    console.log(findParam);
    if (Object.keys(findParam).length == 0) {
        if (callback) {
            callback({});
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
            result = {
                id: pcInfo._id,
                name: pcInfo.name,
                macAddr: pcInfo.macAddr
            };
        }

        if (callback) {
            callback(result);
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
        console.log("result : ")
        console.log(result);
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
                    result = pcInfo;
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
    this.RemoteAirConditioner.update({_id: pcInfo.id}, pcInfo, function(err, numAffected) {
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
module.exports = PcInfo;