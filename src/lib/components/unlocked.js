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
        self.log('unlocked...render');

        if (store.state.currentState === PB.STATE_UNLOCKED) {
            self.modal.content.innerHTML = '';
            self.modal.content.insertAdjacentHTML('beforeend', self.localizer.localize(UnlockedTemplate));
            self.element = DOM.elid('photoblock-unlocked-wrapper'); 
            let photo = DOM.elid('photoblock-photo');  
            photo.src = store.state.photo;


            let backButton = DOM.elid('photoblock-action-back');
            backButton.addEventListener('click', () => {
                store.dispatch('cancelPhoto', {});
            }); 

            let nextButton = DOM.elid('photoblock-action-next');
            nextButton.addEventListener('click', () => {
                self.element = null;
                store.dispatch('saveCollection', { });
            });

            let downloadButton = DOM.elid('photoblock-action-download');
            downloadButton.addEventListener('click', () => {
                self.element = null;
                store.dispatch('downloadPhotoBlock', { });
            });
    
        }
    }

}
