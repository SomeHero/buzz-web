angular
    .module('buzz-web.news')
    .controller('NewsController', NewsController);

NewsController.$inject = ['$scope', 'NewsService'];

function NewsController($scope, NewsService) {
    var self = this;

    NewsService
        .getNews()
        .then(function(result) {
            self.news = result;
        })
        .catch(function(err) {
            console.error(err);
        });

    self.loadMore = () => {
        NewsService
            .getNews(self.news.length/10)
            .then(function(result) {
                self.news = self.news.concat(result);
            })
            .catch(function(err) {
                console.error(err);
            });
    };
}