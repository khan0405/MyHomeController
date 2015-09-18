/**
 * Created by KHAN on 2015-09-15.
 */
var mongoose = require('mongoose');
function AirControllerModel () {};
AirControllerModel.initialize = AirControllerModel.prototype.initialize = function() {
    console.log('initialize AirController....');
    // create scheme
    var AirControllerSchema = new mongoose.Schema({
        currTemperature: Number,
        powerOffScheduleMode: Number,
        selectMode: Number,
        isPowerOn: Boolean
    });

    var AirControllerModel = mongoose.model('RemoteAirController', AirControllerSchema);

    AirControllerModel.find({}, function(err, ac) {
        if (err) {
            console.log(err);
            throw err;
        }
        if (!ac || ac.length === 0) {
            var airController = new AirControllerModel({
                currTemperature: 20,
                powerOffScheduleMode: 0,
                selectMode: 1,
                isPowerOn: false
            });

            airController.save(function (err) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log('create default airController Settings.: ' + airController);
            });
        }
        else {
            console.log('initialize complete....');
        }
    });
};
module.exports = AirControllerModel;