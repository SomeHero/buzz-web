class LocalStorage {
    constructor() {}

    get(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }

    remove(key) {
        localStorage.removeItem(key);
    }
}

angular
    .module('buzz-web.base')
    .service('Storage', LocalStorage);
