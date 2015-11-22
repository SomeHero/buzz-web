angular.module('buzz-web.menu')
    .directive('menu', MenuDirective);

function MenuDirective() {
    return {
        restrict : 'E',
        templateUrl : '/menu/menu.directive.html',
        controller : MenuDirectiveController,
        controllerAs : 'self'
    }
}

MenuDirectiveController.$inject = ['$auth'];

function MenuDirectiveController($auth) {
    var self = this;
    this.Auth = $auth;

    this.logout = function () {
        $auth.logout()
            .then(function() {
                console.log('logout');
            })
            .catch(function(response) {
                console.log(response.data.message, response.status);
            });
    }
}