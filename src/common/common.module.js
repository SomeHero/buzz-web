angular
    .module('buzz-web.common', [
        'ui.router',
        'ui.bootstrap',
        'ngAside',
        'relativeDate',
        'wu.masonry',
        'toastr'
    ])
    .config(configure);

configure.$inject = ['$stateProvider', 'toastrConfig'];
function configure($stateProvider, toastrConfig) {
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