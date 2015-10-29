/**
 * Created by KHAN on 2015-10-18.
 */

var PcController = (function($) {
    var $ajax = function(opt) {
        $.ajax({
            url: '/pcController/' + opt.url,
            data: JSON.stringify(opt.data),
            dataType: 'json',
            method: opt.method,
            contentType: 'application/json',
            success: function(result) {
                console.log(result);
                if (opt.success) {
                    opt.success(result);
                }
            },
            error: function(err) {
                console.log(err);
                if (opt.error) {
                    opt.error(err);
                }
            }
        });
    };

    var getPcInfoFromBtn = function(btnElement) {
        return {
            id: btnElement.attr('data-id'),
            name: btnElement.attr('data-name'),
            macAddr: btnElement.attr('data-mac')
        }
    };

    var powerOn = function(pcInfo) {
        $ajax({
            url: 'powerOn',
            method: 'POST',
            data: pcInfo,
            success: function(result) {
                alert('PC 켜기 신호를 보냈습니다.');
            },
            error: function(err) {
                console.log(err);
                alert('PC를 켜는 데 실패했습니다.');
            }
        });
    };
    var validatePcInfo = function (pcInfo) {
        if (!pcInfo.name) {
            alert('PC 이름을 입력하세요.');
            document.getElementById('name').focus();
            return false;
        }

        var macAddr = pcInfo.macAddr.replace(/-/gi,'');
        if (!/[0-9A-Fa-f]{12}$/g.test(macAddr)) {
            alert('MAC Address를 확인하세요.');
            document.getElementById('macAddr').focus();
            return false;
        }

        return true;
    };

    var setPcInfoToInput = function(pcInfo) {
        pcInfo = pcInfo ? pcInfo : {id: '', name: '', macAddr: '-----', emptyData: true};
        var toggleClassFn = function($elem, clsName) {
            pcInfo.emptyData ? $elem.removeClass(clsName) : $elem.addClass(clsName);
        };

        document.getElementById('id').value = pcInfo.id;
        var $name = $('#name');
        $name.val(pcInfo.name);
        toggleClassFn($name, 'valid');
        $.each(pcInfo.macAddr.split('-'), function(i, mac) {
            var $mac = $('#macAddr' + (i+1));
            $mac.val(mac);
            toggleClassFn($mac, 'valid');
        });
        $.each($('label'), function(i, elem) {
            toggleClassFn($(elem), 'active');
        });
    };

    var bindDocument = function(doc) {
        var $doc = $(doc);
        $doc.ready(function() {
            var inputMac = $('input.macAddr');
            inputMac.blur(function(e) {
                var $this = $(this);
                if (!this.value) {
                    $this.removeClass('invalid');
                    $this.removeClass('valid');
                    return;
                }
                if (/[0-9A-Fa-f]{2}$/g.test(this.value)) {
                    $this.removeClass('invalid');
                    $this.addClass('valid');
                }
                else {
                    $this.addClass('invalid');
                    $this.removeClass('valid');
                }
            });
            inputMac.keyup(function(e) {
                if (this.value.length == 0 && e.keyCode == 8) {
                    var prev = parseInt(this.id.substr(this.id.length-1)) - 1
                    if (prev > 0) {
                        $('#macAddr' + prev).focus();
                    }
                    return;
                }
                if (!/[0-9A-Fa-f]$/g.test(String.fromCharCode(e.keyCode))) return;
                var $this = $(this);
                if (/[0-9A-Fa-f]{2}$/g.test(this.value)) {
                    $this.removeClass('invalid');
                    $this.addClass('valid');
                    var next = parseInt(this.id.substr(this.id.length-1)) + 1
                    console.log(next);
                    if (next > 6) {
                        return;
                    }
                    $('#macAddr' + next).focus();
                }
                else {
                    $this.addClass('invalid');
                    $this.removeClass('valid');
                }
            });

            $('#btnSave').click(function() {
                var pcId = document.getElementById('id').value;

                var macAddr = '';
                for (var i = 1; i < 7; i++) {
                    macAddr += '-' + document.getElementById('macAddr'+i).value
                }
                macAddr = macAddr.replace('-', '');
                var pcInfo = {
                    name: document.getElementById('name').value,
                    macAddr: macAddr
                };
                var savePcInfo = PcController.createPcInfo;
                if (pcId) {
                    pcInfo['id'] = pcId;
                    savePcInfo = PcController.updatePcInfo;
                }
                validatePcInfo(pcInfo) && savePcInfo(pcInfo);
            });

            $('#btnUpdate').click(function() {
                var $menu = $('#PcMenu');
                $menu.closeModal();
                var pcInfo = getPcInfoFromBtn($menu);
                setPcInfoToInput(pcInfo);
            });

            $('#btnRemove').click(function() {
                var $menu = $('#PcMenu');
                $menu.closeModal();
                var pcInfo = getPcInfoFromBtn($menu);
                if (!confirm('PC [' + pcInfo.name + '] 정보를 삭제하시겠습니까?')) {
                    return;
                }
                PcController.removePcInfo(pcInfo);
            });

            $('#btnNewPcInfo').click(function() {
                if (!confirm('입력을 초기화하고 새 PC 정보를 입력하시겠습니까?')) {
                    return;
                }
                setPcInfoToInput();
            });

        });
        $doc.on("click",".btnPowerOn",function() {
            var btn = $(this);
            var pcInfo = getPcInfoFromBtn(btn);
            if (confirm('PC를 켜시겠습니까?')) {
                powerOn(pcInfo);
            }
        });

        $doc.on("click",".btnPowerOn .secondary-content",function(e) {
            e.stopPropagation();
            var $menu = $('#PcMenu');
            var pcInfo = getPcInfoFromBtn($(this).parent());
            $menu.openModal();
            $menu.attr('data-id', pcInfo.id);
            $menu.attr('data-name', pcInfo.name);
            $menu.attr('data-mac', pcInfo.macAddr);
        });
    };

    return {
        getPcList: function (isRefresh) {
            $ajax({
                url: 'list',
                method: 'GET',
                success: function(result) {
                    if (result.data) {
                        var pcListField = $('#pcList');
                        if (isRefresh) {
                            pcListField.children().remove();
                        }
                        if (result.data.length == 0) {
                            pcListField.append($('<li class="collection-item"><div>데이터가 없습니다.</div></li>'));
                            return;
                        }
                        $.each(result.data, function(i, pcInfo) {
                            var field = $("<a></a>");
                            field.addClass('btnPowerOn collection-item waves-effect waves-light');
                            field.attr('data-id', pcInfo.id);
                            field.attr('data-name', pcInfo.name);
                            field.attr('data-mac', pcInfo.macAddr);
                            field.text(pcInfo.name + '[' + pcInfo.macAddr + ']');
                            pcListField.append(field);
                        });
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        },
        createPcInfo: function(pcInfo) {
            $ajax({
                url: 'create',
                method: 'POST',
                data: pcInfo,
                success: function(result) {
                    alert('저장되었습니다.');
                    //setPcInfoToInput();
                    location.reload();
                },
                error: function(err) {
                    console.log(err);
                    alert('저장이 실패했습니다.');
                }
            });
        },
        updatePcInfo: function(pcInfo) {
            $ajax({
                url: 'update',
                method: 'POST',
                data: pcInfo,
                success: function(result) {
                    alert('저장되었습니다.');
                    //setPcInfoToInput();
                    location.reload();
                },
                error: function(err) {
                    console.log(err);
                    alert('저장이 실패했습니다.');
                }
            });
        },
        removePcInfo: function(pcInfo) {
            $ajax({
                url: 'remove',
                method: 'POST',
                data: pcInfo,
                success: function(result) {
                    alert('삭제되었습니다.');
                    //setPcInfoToInput();
                    //PcController.getPcList(true);
                    location.reload();
                },
                error: function(err) {
                    console.log(err);
                    alert('삭제가 실패했습니다.');
                }
            });
        }
    }
})(jQuery, document);