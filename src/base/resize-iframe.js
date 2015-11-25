angular
    .module('buzz-web.base')
    .directive('resize', resize);

function resize() {
    return function (scope, element) {
        var resizing = function() {
            var height = window.innerHeight;
            var width = window.innerWidth;

            element.css('height', height-10 + 'px');
            element.css('width', width-95 + 'px')
        };

        angular.element(window).bind('resize', function () {
            resizing();
        });
        resizing();
    }
}