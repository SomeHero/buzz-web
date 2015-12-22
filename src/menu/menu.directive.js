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

MenuDirectiveController.$inject = ['$auth', '$aside', 'CONFIG'];

function MenuDirectiveController($auth, $aside, CONFIG) {
    var self = this;
    this.Authentication = $auth;
    this.user = self.Authentication.provider.user;
    this.siteTitle = CONFIG.site_title;

    this.logout = function () {
        self.Authentication.provider.logout()
            .then(function() {
                console.log('Logged out');
            })
            .catch(function(err) {
                console.error(err);
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
                            console.log('Logged out');
                        })
                        .catch(function(err) {
                            console.error(err);
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
