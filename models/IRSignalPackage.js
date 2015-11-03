/**
 * Created by KHAN on 2015-11-02.
 */
var IRSignalPackage = (function() {

    var common = require('./common');
    var mongoose = require('mongoose');

    // create scheme
    var IRSignalPackageSchema = new mongoose.Schema({
        name: String,
        signals:[{ type:Schema.ObjectId, ref:"IRSignal" }]
    });
    var IRSignalPackageModel = mongoose.model('IRSignalPackage', IRSignalPackageSchema);

    var IRSignalSchema = new mongoose.Schema({
        packageId: { type:Schema.ObjectId, ref:"IRSignalPackage", childPath:"signals" },
        name: String
    });

    IRSignalSchema.plugin(relationship, { relationshipPathName:'parent' });
    var IRSignalModel = mongoose.model('IRSignal', IRSignalSchema);

    var isUpdate = function(obj) {
        return obj.id ? true : false;
    };

    var replaceFieldName = function(obj, from, to) {
        obj[to] = obj[from];
        obj[from] = undefined;
        return obj;
    };

    var saveObject = function(model, object, callback) {
        if (isUpdate(object)) {
            object = replaceFieldName(object, 'id', '_id');
            model.findByIdAndUpdate(object._id, object, function(err, numberAffected, rawResponse) {
                callback(object, err);
            });
        }
        else {
            model.findOne({name: object.name}, function(err, objInfo) {
                if (objInfo && objInfo.name == object.name) {
                    // duplicate name....
                    callback(undefined, new Error('다른 이름을 사용해 주세요.'));
                }
                else {
                    var o = new model(object);
                    o.save(function(error, obj) {
                        callback(obj, error);
                    });
                }
            });
        }
    };

    var filterSignalObject = function(obj, fromClient) {
        var result = {};
        if (obj) {
            if (fromClient) {
                result = replaceFieldName(obj, 'id', '_id');
            }
            else {
                result = {
                    id: obj._id,
                    name: obj.name,
                    data: obj.data
                };
            }
        }
        return result;
    };

    var filterSignalPackageObject = function(obj, fromClient) {
        var result = {};
        if (obj) {
            if (fromClient) {
                result = replaceFieldName(obj, 'id', '_id');
            }
            else {
                result = {
                    id: obj._id,
                    name: obj.name
                };
            }
        }
        return result;
    };

    return {
        saveIRSignal: function(irSignal, callback) {
            saveObject(IRSignalModel, irSignal, function(irSignal, err) {
                callback && callback(filterSignalObject(irSignal), err);
            });
        },
        saveIRSignalPackage: function(irSignalPackage, callback) {
            saveObject(IRSignalPackageModel, irSignalPackage, function(irSignalPackage, err) {
                callback && callback(filterSignalPackageObject(irSignalPackage), err);
            });
        },
        getIRSignalList: function(irSignalPackage, callback) {
            IRSignalModel.find({packageId: irSignalPackage.id}, function(err, signals) {
                var result = [];
                if (signals && signals.length > 0) {
                    signals.forEach(function(signalInfo){
                        result.push(filterSignalObject(signalInfo));
                    });
                }
                callback && callback(result, err);
            });
        },
        getIRSignalPackage: function(irSignalPackage, callback) {
            var param = {};
            if (irSignalPackage && irSignalPackage.id) {
                param = {_id: irSignalPackage.id};
            }
            IRSignalPackageModel.find(param, function(err, infos) {
                var result = [];
                if (infos && infos.length > 0) {
                    infos.forEach(function (info) {
                        result.push(info);
                    });
                }
                callback(result, err);
            });
        },
        removeIRSignalPackage: function(irSignalPackage, callback) {
            IRSignalPackageModel.find({_id: irSignalPackage.id}).remove(function(err, info) {
                var result = {};
                if (info) {
                    result.id = info.id;
                }
                callback(result, err);
            });
        }
    };
})();

module.exports = IRSignalPackage;