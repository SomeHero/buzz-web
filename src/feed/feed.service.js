var $http, $q;

class FeedService {
    constructor($$http, $$q) {
        $http = $$http;
        $q = $$q;
    }

    getNews(page) {
        return $q(function (resolve, reject) {
            $http
                .get(`http://www.twurl.net/api/v1/twurls?page_number=${page ? page : 1}`)
                .success(function (data) {
                    resolve(data);
                })
                .error(function (err) {
                    console.error(err);
                });
        });
    }
}

FeedService.$inject = ['$http', '$q'];

angular
    .module('buzz-web.feed')
    .service('FeedService', FeedService);