/**
 * Created by KHAN on 2015-09-22.
 */
function Common() {};
Common.errorResponse = function(msg, err) {
    return {code:500, message: msg, error:err};
};
Common.successResponse = function(data, msg) {
    if (!msg) {
        msg = 'success';
    }
    return {code: 200, data: data, message: msg};
};
module.exports = Common;