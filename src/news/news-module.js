angular
    .module('buzz-web.news', [
        'buzz-web.base'
    ])
    .config(configure);

configure.$inject = ['$stateProvider'];
function configure($stateProvider) {
    $stateProvider
        .state('news', {
            abstract : true,
            url : '/news',
            template : '<div ui-view class="fading"></div>'
        })
        .state('news.all', {
            url : '/all',
            templateUrl : 'news/news-controller.html',
            controller : 'NewsController',
            controllerAs : 'self'
        })
        .state('news.myfeed', {
            url : '/myfeed',
            templateUrl : 'news/myfeed-controller.html',
            controller : 'MyFeedController',
            controllerAs : 'self'
        })
}