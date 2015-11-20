angular
    .module('buzz-web.news')
    .controller('NewsController', NewsController);

NewsController.$inject = ['$scope', 'NewsService'];

function NewsController($scope, NewsService) {
    var self = this;

    NewsService
        .getNews()
        .then(function(result) {
        })
        .catch(function(err) {
        });

    self.log = () => { console.log($scope) }
}