angular
    .module('buzz-web.article')
    .controller('ArticleController', ArticleController);

ArticleController.$inject = ['url'];

function ArticleController(url) {
    var self = this;

    self.url = url;
}