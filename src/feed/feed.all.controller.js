angular
    .module('buzz-web.feed')
    .controller('FeedAllController', FeedAllController);

FeedAllController.$inject = ['FeedService', '$auth'];

function FeedAllController(FeedService, $auth) {
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
}