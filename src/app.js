angular
    .module('buzz-web', [
        'buzz-web.base',

        'buzz-web.auth',
        'buzz-web.menu',

        'buzz-web.feed',
        'buzz-web.article'
    ])
    .constant('CONFIG', CONFIG);
