/**
 * Created by KHAN on 2015-09-02.
 */
// lirc module..
var lirc_node = require('lirc_node');
lirc_node.init();

// remote controller map
var rc = {
    powerOff: "UN-JEON/JEONG-JI_OFF",
    low: "LOW",
    high: "HIGH"
};

// express
var express = require('express');
var router = express.Router();

var defaultSuccessResult = {code:200, message:'success'};

router.get('/', function(req, res, next) {
    lirc_node.irsend.send_once('lgac', 'O', function(){
        res.json(defaultSuccessResult);
    });
});