class LocalStorage {
    constructor() {}

    get(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }

    contains() {

    }

    remove(key) {
        localStorage.removeItem(key);
    }

    clear() {

    }
}

angular
    .module('buzz-web.base')
    .service('Storage', function() {
        return new LocalStorage();
    });
