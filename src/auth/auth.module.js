angular
    .module('buzz-web.auth', [
        'buzz-web.base',
        'ngCookies'
    ])
    .config(configure)
    .run(run);

configure.$inject = ['$httpProvider', '$stateProvider'];
function configure($httpProvider, $stateProvider) {
    $httpProvider.interceptors.push('httpInterceptors');

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
        })
        .state('oauth_callback', {
            url: '/oauth/facebook?code&?invitation',
            template : 'Redirecting..',
            controller : ['$location', '$state', '$stateParams', 'Authentication',
                function($location, $state, $stateParams, Authentication) {
                    var state = {};
                    $location
                        .search().state
                        .split(';')
                        .forEach(function(param) {
                            param = param.split(':');
                            state[param[0]] = param[1];
                        });
                    Authentication
                        .oAuthExecute($location.search().code, state.invitation || null)
                        .then(() => { $location.path(state.returnto); })
                        .catch((error) => {
                            console.log(error);
                        })
                }]
        });
        // TODO: twitter oauth
}

run.$inject = ['Authentication'];
function run(Authentication) {
    Authentication.initialize();
}