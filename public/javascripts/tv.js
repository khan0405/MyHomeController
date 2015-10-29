/**
 * Created by KHAN on 2015-10-26.
 */
(function($, doc) {
    var $doc = $(doc);

    var $ajax = function(opt) {
        $.ajax({
            url: '/tv/' + opt.url,
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

    $doc.ready(function() {
        var $btnSelectTvCable = $('#btnSelectTvCable');
        $('.btnModeSelect').click(function () {
            $btnSelectTvCable.find('.inline-center').text(this.text);
            $btnSelectTvCable.attr('data-select', this.getAttribute('data-select'));
        });
    });
})(jQuery, document);