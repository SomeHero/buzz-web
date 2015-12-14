angular
    .module('buzz-web.base', [
        'ui.router',
        'ui.bootstrap',
        'relativeDate',
        'angularGrid',
        'infinite-scroll',
        'angular-loading-bar',
        '720kb.socialshare'
    ])
    .config(configure)
    .run(run);

configure.$inject = ['$locationProvider', '$stateProvider', 'cfpLoadingBarProvider', '$urlRouterProvider'];
function configure($locationProvider, $stateProvider, cfpLoadingBarProvider, $urlRouterProvider) {
    $locationProvider.html5Mode({
        enabled : true,
        requireBase : true,
        rewriteLinks : true
    });

    $stateProvider
        .state('front', {
            url : '/',
            template: '',
            controller : function($state){
                return $state.go('feed.all')
            }
        })
        .state('403', {
            url : '/403',
            template : '<h1>Unauthorised access</h1>',
            controller : 'function(){}'
        })
        .state('404', {
            url : '/404',
            template : '<h1>Page not found</h1>'
        })
        .state('500', {
            url : '/500',
            template : '<h1>Internal error</h1>'
        });

    $urlRouterProvider.otherwise('/feed/all');

    cfpLoadingBarProvider.includeSpinner = false;
}

run.$inject = ['$state', '$rootScope', '$location', '$window'];
function run($state, $root, $location, $window) {
    $root.$on('$stateChangeSuccess',
            function(event){
                if (!$window.ga)
                    return;
                $window.ga('send', 'pageview', { page: $location.path() });
            });

    $root.$state = $state;
}