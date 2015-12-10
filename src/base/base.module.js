angular
    .module('buzz-web.base', [
        'ui.router',
        'ui.bootstrap',
        'ngAside',
        'toastr',
        'relativeDate',
        'akoenig.deckgrid',
        'infinite-scroll',
        'angular-loading-bar',
        '720kb.socialshare'
    ])
    .config(configure)
    .run(run);

configure.$inject = ['$locationProvider', '$stateProvider', 'toastrConfig', 'cfpLoadingBarProvider'];
function configure($locationProvider, $stateProvider, toastrConfig, cfpLoadingBarProvider) {
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

    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'main',
        tapToDismiss: true
    });

    cfpLoadingBarProvider.includeSpinner = true;
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