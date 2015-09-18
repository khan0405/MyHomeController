/**
 * Created by KHAN on 2015-09-15.
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/remote_controller');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection Error:'));
db.once('open', function() {
    console.log('connection successful...');
});

var AirController = require('./remoteAirController');
AirController.initialize();