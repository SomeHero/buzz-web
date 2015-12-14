angular
    .module('buzz-web.feed')
    .controller('FeedAllController', FeedAllController);

FeedAllController.$inject = ['FeedService'];

function FeedAllController(FeedService) {
    var self = this;

    this.feed = [];
    this.currentPage = 1;

    self.busyLoadingData = false;

    self.loadFeed = () => {
        if (self.busyLoadingData) return;

        self.busyLoadingData = true;

        FeedService
            .getFeed(self.currentPage)
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

    self.loadFeed();
}