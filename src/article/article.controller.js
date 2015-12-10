angular
    .module('buzz-web.article')
    .controller('ArticleController', ArticleController);

ArticleController.$inject = ['article', '$sce', '$location'];

function ArticleController(article, $sce, $location) {
    var self = this;
    self.article = article;
    self.location = $location;

    self.url = $sce.trustAsResourceUrl(article.url.replace(new RegExp('%2F','g'),'/'));
}