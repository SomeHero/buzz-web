class CommonService {
    constructor() {}

    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
}

CommonService.$inject = [];

angular
    .module('buzz-web.base')
    .service('CommonService', CommonService);