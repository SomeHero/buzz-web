angular
    .module('buzz-web.feed')
    .controller('FeedMyController', FeedMyController);

FeedMyController.$inject = ['FeedService', '$auth'];

function FeedMyController(FeedService, $auth) {
    var self = this;

    this.Authentication = $auth;
    this.user = self.Authentication.provider.user;

    this.feed = [];
    this.currentPage = 1;

    self.busyLoadingData = false;

    self.loadFeed = (user_id) => {
        if (self.busyLoadingData) return;

        self.busyLoadingData = true;

        FeedService
            .getFeed(self.currentPage, user_id)
            .then(function(result) {
                self.currentPage == 1 ? self.feed = result
                                      : self.feed = self.feed.concat(result);
                self.currentPage++;

                self.busyLoadingData = false;
            })
            .catch(function(err) {
                console.error(err);
                self.busyLoadingData = false;
            });
    };

    if (self.Authentication.provider.isAuthenticated()) {
        self.loadFeed(self.user.id);
    }

    self.authenticate = (provider) => {
        $auth.authenticate(provider)
            .then(function(result) {
                var user = JSON.parse(result.data);
                self.Authentication.provider.setUser(user);

                self.loadFeed(user.id);
            })
            .catch(function(err) {
                console.error(err);
            });
    };
}