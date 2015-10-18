/**
 * Created by KHAN on 2015-10-18.
 */

var PcController = (function() {
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

    $(document).on("click",".btnPowerOn",function() {
        var btn = $(this);
        var pcInfo = getPcInfoFromBtn(btn);
        if (confirm('PC를 켜시겠습니까?')) {
            powerOn(pcInfo);
        }
    });
    return {
        getPcList: function () {
            $ajax({
                url: 'list',
                method: 'GET',
                success: function(result) {
                    if (result.data) {
                        var pcListField = $('#pcList');
                        $.each(result.data, function(i, pcInfo) {
                            var field = $("<a></a>");
                            field.addClass('btnPowerOn');
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
        createPcInfo: function () {

        },
        updatePcInfo: function() {

        },
        removePcInfo: function() {

        }
    }
})();