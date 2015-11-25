var $http, $q, CONFIG;

class FeedService {
    constructor($$http, $$q, $CONFIG) {
        $http = $$http;
        $q = $$q;
        CONFIG = $CONFIG;
    }

    getFeed(page, user_id) {
        var url;
        user_id == undefined ? url = `${CONFIG.api_url}/api/v1/twurls?page_number=${page ? page : 1}`
                             : url = `${CONFIG.api_url}/api/v1/users/${user_id}/feeds?page_number=${page ? page : 1}`;

        return $q(function (resolve, reject) {
            $http
                .get(url)
                .success(function (data) {
                    resolve(data);
                })
                .error(function (err) {
                    console.error(err);
                    reject(err)
                });
        });
    }
}

FeedService.$inject = ['$http', '$q', 'CONFIG'];

angular
    .module('buzz-web.feed')
    .service('FeedService', FeedService);