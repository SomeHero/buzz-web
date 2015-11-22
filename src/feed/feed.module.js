angular
    .module('buzz-web.feed', [
        'buzz-web.base'
    ])
    .config(configure);

configure.$inject = ['$stateProvider'];
function configure($stateProvider) {
    $stateProvider
        .state('feed', {
            abstract : true,
            url : '/feed',
            template : '<div ui-view class="fading"></div>'
        })
        .state('feed.all', {
            url : '/all',
            templateUrl : 'feed/feed.all.controller.html',
            controller : 'FeedAllController',
            controllerAs : 'self'
        })
        .state('feed.my', {
            url : '/my',
            templateUrl : 'feed/feed.my.controller.html',
            controller : 'FeedMyController',
            controllerAs : 'self'
        })
}