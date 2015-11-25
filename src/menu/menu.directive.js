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

MenuDirectiveController.$inject = ['$auth', '$aside', 'toastr'];

function MenuDirectiveController($auth, $aside, toastr) {
    var self = this;
    this.Authentication = $auth;
    this.user = self.Authentication.provider.user;

    this.logout = function () {
        self.Authentication.provider.logout()
            .then(function() {
                toastr.warning('Logged out!', 'Success');
            })
            .catch(function(err) {
                console.error(err);
                toastr.error(err, 'Error');
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
            templateUrl: `menu/aside/${position}.html`,
            placement: position,
            backdrop: backdrop,
            controller: function($scope, $uibModalInstance, $auth) {
                $scope.Authentication = $auth;
                $scope.logout = function () {
                    $scope.Authentication.provider.logout()
                        .then(function() {
                            toastr.warning('Logged out!', 'Success');
                        })
                        .catch(function(err) {
                            console.error(err);
                            toastr.error(err, 'Error');
                        });
                };

                $scope.cancel = function(e) {
                    $uibModalInstance.dismiss();
                    e.stopPropagation();
                };

            }
        }).result.then(postClose, postClose);
    }
}