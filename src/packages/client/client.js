'use strict';

import './client.css';

export default class PhotoBlockClient {

    constructor(containerId, options) {
        this.containerId = containerId;
        this.options = options || {};
        this.app = document.createElement('iframe');
        this.app.id = 'photoblock-app';
    }

    render(callback) {
        let self = this;
        document.body.appendChild(self.app);
        callback();
    }

}