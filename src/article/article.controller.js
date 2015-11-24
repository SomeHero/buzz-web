angular
    .module('buzz-web.article')
    .controller('ArticleController', ArticleController);

ArticleController.$inject = ['article', '$sce'];

function ArticleController(article, $sce) {
    var self = this;
    self.article = article;

    self.url = $sce.trustAsResourceUrl(article.url.replace(new RegExp('%2F','g'),'/'));
}