angular
    .module('buzz-web.auth')
    .provider('Authentication', AuthenticationProvider);

function AuthenticationProvider() {
    this.$get = $get;

    $get.$inject = ['$q', 'Storage', '$auth'];
    function $get($q, Storage, $auth) {
        class Authentication {
            constructor() {
                $auth.provider = this;

                this.user = null;
            }

            initialize() {
                this.user = Storage.get('user');

                if (!this.isAuthenticated()) {
                    return;
                }
            }

            setUser(user) {
                if (!this.user) {
                    this.user = user;
                } else {
                    this.user = angular.extend(this.user, user);
                }
                this.user.version = Date.now();
                Storage.set('user', this.user);
            }

            clearUser() {
                this.user = null;
                Storage.remove('user');
            }

            isAuthenticated() {
                return (!! this.user);
            }

            logout() {
                var deferred = $q.defer();
                this.clearUser();
                deferred.resolve();
                return deferred.promise;
            }
        }

        return new Authentication();
    }
}