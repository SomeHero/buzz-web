angular
    .module('buzz-web.base')
    .directive('googleAdSense', function () {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: "base/googleAds.html",
            controller: function () {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }
        };
    });