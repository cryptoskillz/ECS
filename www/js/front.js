/*global $, document, window, lightbox, setTimeout, jQuery, makeItFixed*/
$(document).ready(function () {

    'use strict';

    // ------------------------------------------------------- //
    // Bootstrap Select initialization
    // ------------------------------------------------------ //
    $('.selectpicker').selectpicker();

    // ------------------------------------------------------- //
    // Parallax effect on divider section
    // ------------------------------------------------------ //
    $(window).scroll(function () {

        var scroll = $(this).scrollTop();

        if ($(window).width() > 1250) {
            $('section.divider').css({
                'background-position': 'left -' + scroll / 6 + 'px'
            });
        } else {
            $('section.divider').css({
                'background-position': 'center bottom'
            });
        }
    });


});
