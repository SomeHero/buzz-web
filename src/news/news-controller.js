angular
    .module('buzz-web.news')
    .controller('NewsController', NewsController);

NewsController.$inject = ['$scope'];

function NewsController($scope) {

    var self = this;

    self.log = () => { console.log($scope) }
}