angular
    .module('buzz-web.base')
    .directive('resize', resize);

function resize() {
    return function (scope, element) {
        var height = window.innerHeight;
        var width = window.innerWidth;

        var resizing = function() {
            element.css('height', height-10 + 'px');
            element.css('width', width-95 + 'px')
        };

        // TODO: not working on window resizing
        angular.element(window).bind('resize', function () {
            resizing();
        });
        resizing();
    }
}