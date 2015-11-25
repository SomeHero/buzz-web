angular
    .module('buzz-web.feed')
    .controller('FeedAllController', FeedAllController);

FeedAllController.$inject = ['FeedService', 'toastr'];

function FeedAllController(FeedService, toastr) {
    var self = this;

    this.feed = [];

    self.loadFeed = (page) => {
        page = Math.ceil(page);

        FeedService
            .getFeed(page)
            .then(function(result) {
                page == 1 ? self.feed = result
                          : self.feed = self.feed.concat(result);
            })
            .catch(function(err) {
                console.error(err);
                toastr.error(err, 'Error');
            });
    };

    self.loadFeed(1);
}