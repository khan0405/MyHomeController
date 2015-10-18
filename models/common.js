/**
 * Created by KHAN on 2015-09-22.
 */
function Common() {};
Common.errorResponse = function(msg, err) {
    return Common.errorResponseWithCode(500, msg, err);
};
Common.errorResponseWithCode = function(code, msg, err) {
    return {code:code, message: msg, error:err};
};
Common.successResponse = function(data, msg) {
    if (!msg) {
        msg = 'success';
    }
    return {code: 200, data: data, message: msg};
};
Common.render = function(req, res, url, opt) {
    opt.currUrl = req.originalUrl;
    res.render(url, opt);
}
module.exports = Common;