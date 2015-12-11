angular
    .module('buzz-web.feed')
    .controller('FeedMyController', FeedMyController);

FeedMyController.$inject = ['FeedService', '$auth', 'toastr', '$state'];

function FeedMyController(FeedService, $auth, toastr, $state) {
    var self = this;
    this.Authentication = $auth;
    this.user = self.Authentication.provider.user;

    this.feed = [];

    self.loadFeed = (page, user_id) => {
        page = Math.ceil(page);
        FeedService
            .getFeed(page, $state.current.name, user_id)
            .then(function(result) {
                page == 1 ? self.feed = result
                          : self.feed = self.feed.concat(result);
            })
            .catch(function(err) {
                console.error(err);
                toastr.error(err, 'Error');
            });
    };

    this.authenticate = (provider) => {
        $auth.authenticate(provider)
            .then(function(result) {
                var user = JSON.parse(result.data);
                self.Authentication.provider.setUser(user);

                self.loadFeed(1, user.id);
                toastr.success(`Welcome, ${user.first_name}`, 'Success');
            })
            .catch(function(err) {
                console.error(err);
                toastr.error(err, 'Error');
            });
    };
}