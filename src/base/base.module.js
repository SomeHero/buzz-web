angular
    .module('buzz-web.base', [
        'ui.router',
        'ui.bootstrap',
        'ngAside',
        'toastr',
        'relativeDate',
        'wu.masonry'
    ])
    .config(configure)
    .run(run);

configure.$inject = ['$locationProvider', '$stateProvider', 'toastrConfig'];
function configure($locationProvider, $stateProvider, toastrConfig) {
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
}

run.$inject = ['$state', '$rootScope'];
function run($state, $root) {
    $root.$state = $state;
}