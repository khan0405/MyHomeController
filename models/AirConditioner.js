/**
 * Created by KHAN on 2015-09-15.
 */

var AirConditioner = (function() {
    var common = require('./common');
    var mongoose = require('mongoose');

    // create scheme
    var AirConditionerSchema = new mongoose.Schema({
        name: String,
        currTemperature: Number,
        powerOffScheduleMode: Number,
        selectMode: Number,
        isPowerOn: Boolean,
        isPowerHigh: Boolean
    });

    var AirConditionerModel = mongoose.model('AirConditioner', AirConditionerSchema);

    //var initialize = function() {
    //    console.log('initialize AirConditioner....');
        AirConditionerModel.findOne({name: 'RACstatus'}, function(err, ac) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!ac || ac.length === 0) {
                var airConditioner = new AirConditionerModel(defaultStatus);

                airConditioner.save(function (err) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    console.log('create default airConditioner Settings.: ' + airConditioner);
                });
            }
            else {
                console.log('initialize complete....:' + JSON.stringify(ac));
            }
        });
    //};

    var KEY = 'RACstatus';
    var defaultStatus = {
        name: 'RACstatus',
        currTemperature: 20,
        powerOffScheduleMode: 1,
        selectMode: 1,
        isPowerOn: false,
        isPowerHigh: true
    };

    //initialize();

    return {
        getCurrStatus: function(callback) {
            AirConditionerModel.findOne({name: KEY}, function(err, ac) {
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
        },
        updateStatus: function(rac, callback) {
            AirConditionerModel.update({name: KEY}, rac, function(err, numAffected) {
                var result;
                if (err) {
                    result = common.errorResponse('status update error.', err);
                    callback(result);
                }
                else {
                    if (callback) {
                        AirConditioner.getCurrStatus(callback);
                    }
                }
            });
        },
        resetStatus: function(callback) {
            return this.updateStatus(defaultStatus, callback);
        }
    };
})();

module.exports = AirConditioner;