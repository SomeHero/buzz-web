angular
    .module('buzz-web.common', [
        'ui.router',
        'ui.bootstrap',
        'ngAside',
        'relativeDate',
        'wu.masonry'
    ])
    .config(configure);

configure.$inject = ['$stateProvider'];
function configure($stateProvider) {
    $stateProvider
        .state('front', {
            url : '/',
            template: '',
            controller : frontController
        });

    frontController.$inject = ['$state'];
    function frontController($state) {
        return $state.go("feed.all")
    }
}