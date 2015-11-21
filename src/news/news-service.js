var $http, $q;

class NewsService {
    constructor($$http, $$q) {
        $http = $$http;
        $q = $$q;
    }

    getNews() {
        return $q(function (resolve, reject) {
            $http
                .get('http://www.twurl.net/api/v1/twurls')
                .success(function (data) {
                    console.log(data);
                    resolve(data);
                })
                .error(function (err) {
                    console.error(err);
                });
        });
    }
}

NewsService.$inject = ['$http', '$q'];

angular
    .module('buzz-web.news')
    .service('NewsService', NewsService);