angular
    .module('buzz-web.auth', [
        'buzz-web.base',
        'satellizer'
    ])
    .config(configure)
    .run(run);

configure.$inject = ['$stateProvider', '$authProvider'];
function configure($stateProvider, $authProvider) {
    $stateProvider
        .state('auth', {
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state('auth.login', {
            url: '/login',
            controller : 'LoginController',
            controllerAs : 'self',
            templateUrl : 'auth/login-controller.html'
        })
        .state('auth.signup', {
            url: '/signup',
            templateUrl : 'auth/signup-controller.html',
            controller : 'SignupController',
            controllerAs : 'self'
        });

    $authProvider
        .twitter({
            url: '/auth/twitter'
        });
}
run.$inject = ['$auth', 'Authentication'];
function run($auth, Authentication) {
    $auth.provider.initialize();
}