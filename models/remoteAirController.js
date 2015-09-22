/**
 * Created by KHAN on 2015-09-15.
 */
var common = require('./common');
var mongoose = require('mongoose');

// create scheme
var AirControllerSchema = new mongoose.Schema({
    name: String,
    currTemperature: Number,
    powerOffScheduleMode: Number,
    selectMode: Number,
    isPowerOn: Boolean,
    isPowerHigh: Boolean
});
var AirControllerModel = mongoose.model('AirController', AirControllerSchema);

function AirController () {};
AirController.initialize = AirController.prototype.initialize = function() {
    console.log('initialize AirController....');
    AirControllerModel.findOne({name: 'RACstatus'}, function(err, ac) {
        if (err) {
            console.log(err);
            throw err;
        }
        if (!ac || ac.length === 0) {
            var airController = new AirControllerModel(defaultStatus);

            airController.save(function (err) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log('create default airController Settings.: ' + airController);
            });
        }
        else {
            console.log('initialize complete....:' + JSON.stringify(ac));
        }
    });
};

AirController.initialize();

var KEY = 'RACstatus';
var defaultStatus = {
    name: 'RACstatus',
    currTemperature: 20,
    powerOffScheduleMode: 1,
    selectMode: 1,
    isPowerOn: false,
    isPowerHigh: true
}

AirController.RemoteAirController = AirControllerModel;
AirController.getCurrStatus = function(callback) {
    this.RemoteAirController.findOne({name: KEY}, function(err, ac) {
        var result;
        if (err) {
            result = common.errorResponse('current status getting error.', err);
        }
        else {
            result = {
                currTemperature: ac.currTemperature,
                powerOffScheduleMode: ac.powerOffScheduleMode,
                selectMode: ac.selectMode,
                isPowerOn: ac.isPowerOn,
                isPowerHigh: ac.isPowerHigh
            };
        }
        if (callback) {
            callback(result);
        }
    });
}
AirController.updateStatus = function(rac, callback) {
    this.RemoteAirController.update({name: KEY}, rac, function(err, numAffected) {
        var result;
        if (err) {
            result = common.errorResponse('status update error.', err);
            callback(result);
        }
        else {
            if (callback) {
                AirController.getCurrStatus(callback);
            }
        }
    });
}
AirController.resetStatus = function(callback) {
    return this.updateStatus(defaultStatus, callback);
}
module.exports = AirController;