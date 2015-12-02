angular
    .module('buzz-web.base')
    .directive('setSize', setSize);

function setSize($timeout) {
    return function (scope, element, attr) {
        var sizing = function () {
            element
                .css('height', attr.height/attr.width * $('.tile').width())
        };

        $timeout(function(){
            sizing();
        }, 0);

        angular.element(window).bind('resize', function () {
            sizing();
        });
    }
}
