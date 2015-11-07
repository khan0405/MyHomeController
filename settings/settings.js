/**
 * Created by KHAN on 2015-11-08.
 */
exports = module.exports = (function() {
    // default option
    options = global.options = {
        lircEnabled : false
    };

    // server options
    var SERVER_OPTIONS = {
        '--enable-lirc': function() {
            options.lircEnabled = true;
        }
    };

    var args = process.argv.slice(2);

    args && args.forEach(function (val) {
        SERVER_OPTIONS[val] && SERVER_OPTIONS[val]();
    });

    console.log('global options: ' + JSON.stringify(options));
})();