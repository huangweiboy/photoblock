'use strict';
import Dexie from 'dexie';
import PB from '../core/constants';

export default class Recent {

    constructor() {    
        try {
            this.db = new Dexie(PB.DB.NAME);
            this.db.version(PB.DB.VERSION).stores({
                recents: 'key,lastUsed,photo,saved',
                settings: 'key, value'
            })
        }
        catch(e) {
            throw('Browser does not support IndexedDB database');
        }
    }

    getSetting(key, callback) {
        let self = this;
        self.db.settings.get(key, callback);
    }

    saveSetting(key, value, callback) {
        let self = this;
        self.db.settings
                    .update(key, value)
                    .then(callback());       
    }

    add(recent, callback) {
        let self = this;
        self.db.recents
                    .put(recent)
                    .then(callback())
                    .catch((err) => {
                        callback(null, err);
                    })
    }

    get(key, callback) {
        let self = this;
        self.db.recents.get(key, callback);
    }

    delete(key, callback) {
        let self = this;
        self.db.recents
                .delete(key)
                .then(callback());
    }

    updateLastUsed(key, callback) {
        let self = this;
        self.db.recents
                    .update(key, {lastUsed: Date.now()})
                    .then(callback());
    }

    all(callback) {
        let self = this;
        self.db.recents
                    .reverse()
                    .sortBy('lastUsed', callback);
    }
}