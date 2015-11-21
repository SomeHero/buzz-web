angular
    .module('buzz-web.news')
    .controller('MyFeedController', MyFeedController);

MyFeedController.$inject = ['$scope', 'NewsService'];

function MyFeedController($scope, NewsService) {
    var self = this;

    self.log = () => { console.log($scope) }
}