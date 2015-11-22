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

MenuDirectiveController.$inject = ['$auth', '$aside'];

function MenuDirectiveController($auth, $aside) {
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
    };

    self.asideState = {
        open: false
    };

    self.openAside = function(position, backdrop) {
        self.asideState = {
            open: true,
            position: position
        };

        function postClose() {
            self.asideState.open = false;
        }

        $aside.open({
            templateUrl: 'menu/aside/right.html',
            placement: position,
            size: 'sm',
            backdrop: backdrop,
            controller: function($scope, $uibModalInstance, $auth) {
                $scope.Auth = $auth;
                $scope.logout = function () {
                    $auth.logout()
                        .then(function() {
                            console.log('logout');
                        })
                        .catch(function(response) {
                            console.log(response.data.message, response.status);
                        });
                };

                $scope.cancel = function(e) {
                    $uibModalInstance.dismiss();
                    e.stopPropagation();
                };

            },
            controllerAs: 'modal'
        }).result.then(postClose, postClose);
    }
}