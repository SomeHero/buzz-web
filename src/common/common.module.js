angular
    .module('buzz-web.common', [
        'ui.router',
        'ui.bootstrap',
        'ngAside',
        'toastr',
        'relativeDate',
        'wu.masonry'
    ])
    .config(configure);

configure.$inject = ['$stateProvider', 'toastrConfig'];
function configure($stateProvider, toastrConfig) {
    $stateProvider
        .state('front', {
            url : '/',
            template: '',
            controller : function($state){
                return $state.go('feed.all')
            }
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