angular
    .module('buzz-web.feed')
    .controller('FeedAllController', FeedAllController);

FeedAllController.$inject = ['FeedService', 'toastr', '$state'];

function FeedAllController(FeedService, toastr, $state) {
    var self = this;

    this.feed = [];

    self.loadFeed = (page) => {
        page = Math.ceil(page);
        if (page < 1) { page = 1; }

        FeedService
            .getFeed(page, $state.current.name)
            .then(function(result) {
                page == 1 ? self.feed = result
                          : self.feed = self.feed.concat(result);
            })
            .catch(function(err) {
                console.error(err);
                toastr.error(err, 'Error');
            });
    };
}