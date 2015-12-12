angular
    .module('buzz-web.base')
    .directive('resize', resize);

function resize($timeout) {
    return function (scope, element) {
        var resizing = function() {
            var height = window.innerHeight;
            var width = window.innerWidth;
            var paddingTop = 0,
                paddingLeft = 0;

            if (width < 769) {
                paddingTop = $('.sidebar').height();
            }
            if (width >= 769) {
                paddingLeft = 100;
            }

            $('.frame')
                .css("padding-top", `${paddingTop}px`)
                .css("padding-left", `${paddingLeft}px`);

            element
                .css('height', (height - paddingTop)-5 + 'px')
                .css('width', (width-paddingLeft) + 'px');
        };

        $timeout(function(){
            resizing();
        }, 0);

        angular.element(window).bind('resize', function () {
            resizing();
        });
    }
}