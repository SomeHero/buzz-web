angular
    .module('buzz-web.feed')
    .controller('FeedMyController', FeedMyController);

FeedMyController.$inject = ['FeedService', '$auth', 'toastr', '$state'];

function FeedMyController(FeedService, $auth, toastr, $state) {
    var self = this;

    this.Authentication = $auth;
    this.user = self.Authentication.provider.user;

    this.feed = [];
    this.currentPage = 1;

    self.loadFeed = (user_id) => {
        FeedService
            .getFeed(self.currentPage, user_id)
            .then(function(result) {
                self.currentPage == 1 ? self.feed = result
                                      : self.feed = self.feed.concat(result);
                self.currentPage++;
            })
            .catch(function(err) {
                console.error(err);
                toastr.error(err, 'Error');
            });
    };

    self.loadFeed(self.user.id);

    self.authenticate = (provider) => {
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