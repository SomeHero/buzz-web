var $http, $location, $q;

class NewsService {
    constructor($$http, $$location, $$q) {
        $http = $$http;
        $location = $$location;
        $q = $$q;
    }

    getNews() {
        return $q(function(resolve, reject){

        });
    }
}

NewsService.$inject = ['$http', '$location', '$q'];

angular
    .module('buzz-web.news')
    .service('NewsService', NewsService);