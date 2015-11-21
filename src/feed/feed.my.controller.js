angular
    .module('buzz-web.feed')
    .controller('FeedMyController', FeedMyController);

FeedMyController.$inject = ['$scope', 'FeedService'];

function FeedMyController($scope, FeedService) {
    var self = this;

    self.log = () => { console.log($scope) }
}