var $http, $q, $CONFIG;

class FeedService {
    constructor($$http, $$q, $CONFIG) {
        $http = $$http;
        $q = $$q;
        CONFIG = $CONFIG;
    }

    getFeed(page) {
        return $q(function (resolve, reject) {
            $http
                .get(`${CONFIG.api_url}/api/v1/twurls?page_number=${page ? page : 1}`)
                .success(function (data) {
                    resolve(data);
                })
                .error(function (err) {
                    console.error(err);
                });
        });
    }

    getMyFeed(user_id) {
        return $q(function (resolve, reject) {
            $http
                .get(`${CONFIG.api_url}/api/v1/users/${user_id}/feeds`)
                .success(function (data) {
                    resolve(data);
                })
                .error(function (err) {
                    console.error(err);
                });
        });
    }
}

FeedService.$inject = ['$http', '$q', 'CONFIG'];

angular
    .module('buzz-web.feed')
    .service('FeedService', FeedService);