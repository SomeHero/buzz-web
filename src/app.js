angular
    .module('buzz-web', [
        'buzz-web.common',
        'buzz-web.base',
        'buzz-web.auth',
        'buzz-web.menu',

        'buzz-web.feed'
    ])
    .constant('CONFIG', CONFIG);
