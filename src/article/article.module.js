angular
    .module('buzz-web.article', [
        'buzz-web.base'
    ])
    .config(configure);

configure.$inject = ['$stateProvider'];
function configure($stateProvider) {
    $stateProvider
        .state('article', {
            abstract : true,
            url : '/article',
            template : '<div ui-view class="fading"></div>'
        })
        .state('article.id', {
            url : '/:id?url?return?headline',
            templateUrl : 'article/article.controller.html',
            controller : 'ArticleController',
            controllerAs : 'self',
            resolve : {
                article: [ '$stateParams', function($stateParams) {
                    return $stateParams;
                }]
            }
        })
}