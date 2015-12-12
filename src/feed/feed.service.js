var $http, $q, CONFIG;

class FeedService {
    constructor($$http, $$q, $CONFIG) {
        $http = $$http;
        $q = $$q;
        CONFIG = $CONFIG;
    }

    getFeed(page, state, user_id) {
        var url;
        user_id == undefined ? url = `${CONFIG.api_url}/api/v1/feeds/${CONFIG.feed_id}/twurls?page_number=${page ? page : 1}`
                             : url = `${CONFIG.api_url}/api/v1/users/${user_id}/feeds?page_number=${page ? page : 1}`;
        return $q(function (resolve, reject) {
            $http
                .get(url)
                .success(function (data) {
                    data.forEach(function(el, i){
                        el.returnTo = state;
                        if ((i+1) % 10 == 0 && page == 1) {
                            data.splice((i-1), 0, { type : 'adv' });
                        }
                    });
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
