angular
    .module('buzz-web.feed')
    .controller('FeedMyController', FeedMyController);

FeedMyController.$inject = ['FeedService', '$auth', 'toastr'];

function FeedMyController(FeedService, $auth, toastr) {
    var self = this;
    this.Auth = $auth;

    FeedService
        .getNews()
        .then(function(result) {
            self.news = result;
        })
        .catch(function(err) {
            console.error(err);
        });

    self.loadMore = () => {
        FeedService
            .getNews(self.news.length/10)
            .then(function(result) {
                self.news = self.news.concat(result);
            })
            .catch(function(err) {
                console.error(err);
            });
    };

    this.authenticate = function(provider) {
        $auth.authenticate(provider)
            .then(function() {
                toastr.success('Logged in!', 'Success');
                return $auth.service.getProfile()
            })
            .then(function (user) {
                $auth.user = user.data;
            })
            .catch(function(err) {
                toastr.error(err, 'Error');
            });
    };
}