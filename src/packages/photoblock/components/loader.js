'use strict';
import PB from '../core/constants';
import DOM from '../core/dom';
import Component from '../core/component';
import store from '../store/index';
import LoaderTemplate from "./templates/loader.html";

export default class Loader extends Component {
    constructor(modal) {
        super({
            store 
        });

        this.element = null;
        this.dropArea = null;
        this.dropFiles = null;
        this.modal = modal;
    }
    
    render() {

        let self = this;
        self.log('loader...render');

        if (store.state.currentState === PB.STATE_LOAD) {
            let template = LoaderTemplate;
            if (store.state.error == PB.ERROR.NO_CONTEXT) {
                template = template.replace('\{error\}', '\{error.noContext\}');
            }
            self.modal.content.innerHTML = '';
            self.modal.content.insertAdjacentHTML('beforeend', self.localizer.localize(template));
            self.element = DOM.elid('photoblock-loader-wrapper'); 
        
            if (store.state.fresh) {
                DOM.elid('photoblock-fresh-message').removeAttribute('style');
                DOM.elid('photoblock-loader-wrapper').className = "photoblock-fresh";
            } else {
                if (store.state.error !== null) {
                    DOM.elid('photoblock-error-message').removeAttribute('style');
                } else {
                    DOM.elid('photoblock-new-message').removeAttribute('style');
                }
                DOM.elid('photoblock-loader-wrapper').className = "photoblock-new";    
            }

            self.dropFiles = DOM.elid("photoblock-files");
            self.dropArea = DOM.elid("photoblock-drop-area");
            self.dropFiles.onchange = (evt) => {
                self.handleFiles(evt.target.files);
            }
 
            // Prevent default drag behaviors
            ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
                self.dropArea.addEventListener(eventName, (e) => { self.preventDefaults(e); }, false);
                document.body.addEventListener(eventName, self.preventDefaults, false);
            });
    
            // Highlight drop area when item is dragged over it
            ["dragenter", "dragover"].forEach(eventName => {
                self.dropArea.addEventListener(eventName, () => { self.highlight(); }, false);
            });
    
            ["dragleave", "drop"].forEach(eventName => {
                self.dropArea.addEventListener(eventName, () => { self.unhighlight(); }, false);
            });
     
            // Handle dropped files
            self.dropArea.addEventListener("drop", (e) => { self.handleDrop(e); }, false);
    
        }

    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight() {
        this.dropArea.classList.add("photoblock-drop-area-highlight");
    }

    unhighlight() {
        this.dropArea.classList.remove("photoblock-drop-area-highlight");
    }

    handleDrop(e) {
        this.unhighlight();
        let dt = e.dataTransfer;
        let files = dt.files;
        this.handleFiles(files); 
    }

    handleFiles(files) {        
        if (files.length > 0) { 
            // Only first file is processed
            this.processFile(files[0]);
        }
    }

    processFile(file) {
        let reader = new FileReader();
        reader.onloadend = function (event) {
            store.dispatch('loadPhoto', { imgBuffer: event.target.result });
        }
        reader.readAsArrayBuffer(file);
    }

}
