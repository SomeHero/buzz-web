angular
    .module('buzz-web.feed')
    .controller('FeedMyController', FeedMyController);

FeedMyController.$inject = ['FeedService', '$auth'];

function FeedMyController(FeedService, $auth) {
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
                return $auth.service.getProfile()
            })
            .then(function (user) {
                $auth.user = user.data;
            })
            .catch(function(error) {
                console.log(error);
            });
    };
}