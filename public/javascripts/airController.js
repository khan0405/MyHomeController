/**
 * Created by KHAN on 2015-09-04.
 */
(function(global, factory){
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "AirController requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
    var AirController = function () {

        var currTemperature = 0;
        var powerOffScheduleMode = 0;
        var selectMode = 0;
        var isPowerHigh = true;
        var isPowerOn = false;
        var initCallback;

        var keyMap = {
            selectMode: 'UN-JEON-SEON-TAEK_',
            sleep: 'JEOL-JEON',
            powerOffSchedule: 'GEO-JIM-YE-YAK_',
            powerCold: 'PA-WEO-NAENG-BANG',
            airControll: 'PUNG-HYANG-SANG-HA',
            powerOn: 'UN-JEON/JEONG-JI_',
            powerOff: 'UN-JEON/JEONG-JI_OFF',
            low: 'LOW_',
            high: 'HIGH_'
        };

        var _AirController = this;

        $.get('/test/currStatus', function (result) {
            console.log(result);
            if (result.currTemperature < 18 || result.currTemperature > 30) {
                currTemperature = 18;
            }
            else {
                currTemperature = result.currTemperature;
            }

            powerOffScheduleMode = result.powerOffScheduleMode;
            selectMode = result.selectMode;
            isPowerOn = result.isPowerOn;

            if (initCallback) {
                initCallback(result);
            }
        }).fail(function (err) {
            console.log(err);
        });

        this.setWorkSelectMode = function (mode, callback, fail, done) {
            if (mode !== 1 && mode !== 2) {
                mode = 1;
            }
            selectMode = mode;
            remoteCmd(keyMap.selectMode + mode, callback, fail, done);
        };

        this.setPowerOffSchedule = function (mode, callback, fail, done) {
            if (mode < 0 || mode > 7) {
                mode = 1;
            }
            powerOffScheduleMode = mode;
            if (mode === 0) {
                mode = 'OFF';
            }
            remoteCmd(keyMap.powerOffSchedule + mode, callback, fail, done);
        };

        this.powerOnOff = function () {
            var cmd = '';
            if (isPowerOn) {
                cmd = keyMap.powerOff;
            }
            else {
                cmd = keyMap.powerOn + currTemperature;
            }
            cmd = encodeURIComponent(cmd);
            $.post('/test/cmd/' + cmd, function (result) {
                console.log(result);
            });
        };

        this.setPowerHigh = function (_isPowerHigh) {
            isPowerHigh = _isPowerHigh;
            this.setTemperature();
        };

        this.setTemperature = function (temperature) {
            if (!temperature) {
                temperature = currTemperature;
            }
            else {
                if (temperature < 18 || temperature > 30) {
                    alert('온도가 잘못되었습니다');
                    return false;
                }
                else {
                    currTemperature = temperature;
                }
            }

            var cmd = encodeURIComponent((isPowerHigh ? keyMap.high : keyMap.low) + temperature);

            remoteCmd(cmd, function(result) {});
        };

        this.toggleWindDirection = function () {
            console.log('toggleWindDirection');
        };

        var remoteCmd = function(cmd, callback, fail, done) {
            $.post(
                '/test/cmd/' + cmd,
                function(result) {
                    console.log(result);
                    if (callback) {
                        callback(result);
                    }
                }
            ).fail(fail).done(done);
        }

        this.bind = function() {
            $(document).ready(function () {
                var btnPower = $('#btnPower');
                var btnSelectWorkMode = $('#btnSelectWorkMode');
                var btnToggleWindDirection = $('#btnToggleWindDirection');
                var btnSelectWindPower = $('#btnSelectWindPower');
                var btnPowerOffSchedule = $('#btnPowerOffSchedule');

                btnPower.on('click', function () {
                    _AirController.powerOnOff();
                });

                $('.temperature-item').on('click', function () {
                    var temperature = $(this).attr('data');
                    $('#temperature').text(temperature + '℃');
                    $('#temperatureItems').val(temperature);
                    _AirController.setTemperature(temperature);
                });

                btnSelectWorkMode.on('click', function() {
                    btnClickAction(btnSelectWorkMode, function(done) {
                        _AirController.setWorkSelectMode((selectMode + 1) % 2 + 1,
                            function(result) {
                                if (result.code === 200) {
                                    console.log('변경됨');
                                }
                            },
                            function(error) {
                                console.log('변경 실패');
                                console.log(error);
                            },
                            done
                        );
                    });
                });
                btnToggleWindDirection.on('click', function() {
                    btnClickAction(btnToggleWindDirection, function(done) {
                        _AirController.toggleWindDirection();
                    });
                });
                btnSelectWindPower.on('click', function() {
                    _AirController.setPowerHigh(!isPowerHigh);
                });
                btnPowerOffSchedule.on('click', function() {
                    powerOffScheduleMode = (++powerOffScheduleMode) % 6;
                });
            });
        }

        var btnClickAction = function(element, func) {
            var done = function() {
                console.log('done');
                element.removeAttr('worked');
            };
            var worked = element.attr('worked');
            if (worked === 'worked') return;
            element.attr('worked','worked');
            func(done);
        }
        this.bind();
        initCallback = function (result) {
            console.log('bind temperature: ' + result.currTemperature);
            $('#temperature').text(result.currTemperature + '℃');
            $('#temperatureItems').val(result.currTemperature);
        }
    }

    window.AirController = new AirController();
}));
