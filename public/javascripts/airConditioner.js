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
    var AirConditioner = function () {

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

        var _AirConditioner = this;

        $.get('/airConditioner/status', function (result) {
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
            remoteCmd(keyMap.selectMode + mode, {selectMode: mode}, callback, fail, done);
        };

        this.setPowerOffSchedule = function (mode, callback, fail, done) {
            if (mode < 0 || mode > 7) {
                mode = 1;
            }
            powerOffScheduleMode = mode;
            if (mode === 0) {
                mode = 'OFF';
            }
            remoteCmd(keyMap.powerOffSchedule + mode, {powerOffScheduleMode: mode}, callback, fail, done);
        };

        this.powerOnOff = function (callback) {
            var cmd = '';
            if (isPowerOn) {
                cmd = keyMap.powerOff;
            }
            else {
                cmd = keyMap.powerOn + currTemperature;
            }

            cmd = encodeURIComponent(cmd);
            remoteCmd(cmd, {isPowerOn: !isPowerOn}, function(result) {
                if (result) {
                    isPowerOn = result.isPowerOn;
                    // 파워온된 모습 보여줘야함;
                    if (callback) callback();
                }
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

            remoteCmd(cmd, {currTemperature: temperature, isPowerHigh: isPowerHigh}, function(result) {});
        };

        this.toggleWindDirection = function (error, done) {
            remoteCmd(keyMap.airControll, undefined, function(result) {
            }, error, done);
        };

        var remoteCmd = function(cmd, data, callback, fail, done) {
            $.post(
                '/airConditioner/status/' + cmd,
                data,
                function(result) {
                    console.log(result);
                    if (callback) {
                        callback(result);
                    }
                }
            ).fail(fail).done(done);
        }

        var setPowerOn = function(powerOnLed) {
            if (isPowerOn) {
                powerOnLed.addClass('powerOn')
            }
            else {
                powerOnLed.removeClass('powerOn');
            }
        }

        var isDisable = function (elem) {
            return $(elem).hasClass('disabled');
        }

        this.bind = function() {
            $(document).ready(function () {
                var btnPower = $('#btnPower');
                var btnSelectWorkMode = $('#btnSelectWorkMode');
                var btnToggleWindDirection = $('#btnToggleWindDirection');
                var btnSelectWindPower = $('#btnSelectWindPower');
                var btnPowerOffSchedule = $('#btnPowerOffSchedule');

                btnPower.on('click', function () {
                    if (isDisable(this)) return;
                    _AirConditioner.powerOnOff(function () {
                        setPowerOn($('#powerLed'));
                        toggleEnabled(isPowerOn);
                    });
                });

                $('.temperature-item').on('click', function () {
                    if (isDisable(this)) return;
                    var temperature = $(this).attr('data');
                    $('#temperature').text(temperature + '℃');
                    $('#temperatureItems').val(temperature);
                    _AirConditioner.setTemperature(temperature);
                });

                btnSelectWorkMode.on('click', function() {
                    if (isDisable(this)) return;
                    btnClickAction(btnSelectWorkMode, function(done) {
                        _AirConditioner.setWorkSelectMode((selectMode + 1) % 2 + 1,
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
                    if (isDisable(this)) return;
                    btnClickAction(btnToggleWindDirection, function(done) {
                        _AirConditioner.toggleWindDirection(function(error) {
                            console.log(error);
                        }, done);
                    });
                });
                btnSelectWindPower.on('click', function() {
                    if (isDisable(this)) return;
                    _AirConditioner.setPowerHigh(!isPowerHigh, function(result) {
                        console.log(result);
                    });
                });
                btnPowerOffSchedule.on('click', function() {
                    if (isDisable(this)) return;
                    powerOffScheduleMode = (++powerOffScheduleMode) % 6;
                    _AirConditioner.setPowerOffSchedule(powerOffScheduleMode, function(result) {
                        console.log(result);
                    });
                });

                initCallback = function (result) {
                    $('#temperature').text(result.currTemperature + '℃');
                    $('#temperatureItems').val(result.currTemperature);
                    setPowerOn($('#powerLed'));
                    toggleEnabled(result.isPowerOn);
                }

                var toggleEnabled = function(enabled) {
                    $(".btnComponent").each(function (i, elem) {
                        var btn = $(elem);
                        if (enabled) {
                            btn.removeClass('disabled');
                            btn.addClass('waves-effect');
                            btn.addClass('waves-light');
                            if (btn[0].id === 'temperature') {
                                btn.dropdown();
                            }
                        }
                        else {
                            btn.addClass('disabled');
                            btn.removeClass('waves-effect');
                            btn.removeClass('waves-light');
                            if (btn[0].id === 'temperature') {
                                $('#temperature').unbind();
                            }
                        }
                    });
                }

            });
        }

        var btnClickAction = function(element, func) {
            var done = function() {
                element.removeAttr('worked');
            };
            var worked = element.attr('worked');
            if (worked === 'worked') return;
            element.attr('worked','worked');
            func(done);
        }

        this.bind();
    }

    window.AirConditioner = new AirConditioner();
}));
