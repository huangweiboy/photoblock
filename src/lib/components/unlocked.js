"use strict";
import PB from '../core/constants';
import DOM from '../core/dom';
import Component from '../core/component';
import store from '../store/index';
import UnlockedTemplate from "./templates/unlocked.html";

export default class Unlocked extends Component {
    constructor(modal) {
        super({
            store 
        });

        this.element = null;
        this.modal = modal;
    }

    render() {

        let self = this;
        self.log('unlocked..render');

        if (store.state.currentState === PB.STATE_UNLOCKED) {
            self.modal.content.innerHTML = '';
            self.modal.content.insertAdjacentHTML('beforeend', UnlockedTemplate);
            self.element = DOM.elid('photoblock-photo');  
            self.element.src = store.state.photo.imgData;
        }
    }

}
 