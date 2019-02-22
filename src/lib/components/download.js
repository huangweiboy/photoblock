"use strict";
import PB from '../core/constants';
import DOM from '../core/dom';
import Component from '../core/component';
import store from '../store/index';
import DownloadTemplate from "./templates/download.html";

export default class Download extends Component {
    constructor(modal) {
        super({
            store
        });

        this.element = null;
        this.modal = modal;
    }
    
    render() {

        let self = this;
        self.log('download...render');

        if (store.state.currentState === PB.STATE_DOWNLOAD) {
            self.modal.content.innerHTML = '';
            self.modal.content.insertAdjacentHTML('beforeend', self.localizer.localize(DownloadTemplate));
            self.element = DOM.elid('photoblock-download-wrapper'); 
            if (store.state.photoEngine != null) {
                let photo = DOM.elid('photoblock-photo');  
                store.state.photoEngine.getDataUri(img => photo.src = img);
            }


            let backButton = DOM.elid('photoblock-action-back');
            backButton.addEventListener('click', () => {
                store.dispatch('cancelPhoto', {});
            }); 

            let downloadButton = DOM.elid('photoblock-action-download');
            downloadButton.addEventListener('click', () => {
//                self.element = null;
                DOM.elid('photoblock-loader').removeAttribute('style');
                store.dispatch('savePhotoBlock', { });
            });
    
        }
    }

}
