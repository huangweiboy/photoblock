'use strict';
import Dexie from 'dexie';
import PB from '../core/constants';

export default class Recent {

    constructor() {    
        try {
            this.db = new Dexie(PB.DB.NAME);
            this.db.version(PB.DB.VERSION).stores({
                recents: 'key,lastUsed,photo,saved'
            })
        }
        catch(e) {
            throw('Browser does not support IndexedDB database');
        }
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

    all(callback) {
        let self = this;
        self.db.recents
                    .reverse()
                    .sortBy('date', callback);
    }
}