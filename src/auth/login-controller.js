angular
    .module('buzz-web.auth')
    .controller('LoginController', LoginController);

LoginController.$inject = ['$state', 'Authentication', '$location'];

function LoginController ($state, Authentication, $location) {
    var self = this;

    this.alerts = [];
    this.Authentication = Authentication;
    this.email = '';
    this.password = '';

    this.login = (data) => {
        // TODO: check data and through alerts
    };

    this.signup = (data) => {
        console.log(data)
    };

    this.closeAlert = (i) => { this.alerts.splice(i, 1);}
}
