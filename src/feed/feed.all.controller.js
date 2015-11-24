angular
    .module('buzz-web.feed')
    .controller('FeedAllController', FeedAllController);

FeedAllController.$inject = ['FeedService', '$auth', 'toastr'];

function FeedAllController(FeedService, $auth, toastr) {
    var self = this;
    this.Auth = $auth;

    FeedService
        .getNews()
        .then(function(result) {
            self.news = result;
        })
        .catch(function(err) {
            console.error(err);
            toastr.error(err, 'Error');
        });

    self.loadMore = () => {
        FeedService
            .getNews(self.news.length/10)
            .then(function(result) {
                self.news = self.news.concat(result);
            })
            .catch(function(err) {
                console.error(err);
                toastr.error(err, 'Error');
            });
    };
}