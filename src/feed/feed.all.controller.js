angular
    .module('buzz-web.feed')
    .controller('FeedAllController', FeedAllController);

FeedAllController.$inject = ['FeedService', 'toastr'];

function FeedAllController(FeedService, toastr) {
    var self = this;

    this.feed = [];

    self.loadFeed = (page) => {
        page = Math.ceil(page);
        if (page < 1) { page = 1; }

        FeedService
            .getFeed(page)
            .then(function(result) {
                page == 1 ? self.feed = result
                          : self.feed = self.feed.concat(result);
                console.log(self.feed)
            })
            .catch(function(err) {
                console.error(err);
                toastr.error(err, 'Error');
            });
    };
}