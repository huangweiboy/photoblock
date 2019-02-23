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

        if (store.state.currentState === PB.STATE_READY) {
            self.modal.content.innerHTML = '';
            self.modal.content.insertAdjacentHTML('beforeend', self.localizer.localize(UnlockedTemplate));
            self.element = DOM.elid('photoblock-unlocked-wrapper'); 
            self.element = DOM.elid('photoblock-photo');  
            if (store.state.photoEngine != null) {
                store.state.photoEngine.getDataUri((img) => {
                    self.element.src = img;                    
                });
            }

            let widget = DOM.elid('photoblock-widget-icon');
            if (widget != null) {
                store.state.photoEngine.getDataUri((img) => {
                    widget.src = img;                    
                });
            }

            let nextButton = DOM.elid('photoblock-action-next');
            nextButton.addEventListener('click', () => {
                self.element = null;
                store.dispatch('saveCollection', { });
            });

    
        }
    }

}
