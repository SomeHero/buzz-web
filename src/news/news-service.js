'use strict';

function NewsService ($http, $q) {
    var self = this;

    this.getNews = function(){
        return $q(function(resolve, reject){
            //$http
            //    .get('https://www.twurl.net/api/v1/twurls')
            //    .success(function(data){
            //        resolve(data);
            //    })
            //    .error(function(err){
            //    })

            $http.jsonp('https://www.twurl.net/api/v1/twurls',
                {
                    headers: {
                        'Content-Type': 'application/json' ,
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers':'X-Requested-With'
                    }
                }).success(function(response) {
                console.log(response);

            }).
            error(function (data, status) {
                alert(JSON.stringify(data));
                alert(JSON.stringify(status));
            });
        });
    }
}

NewsService.$inject = ['$http', '$q'];

angular
    .module('buzz-web.news')
    .service('NewsService', NewsService);