'use strict';
import PB from '../core/constants';
import DOM from '../core/dom';
import Component from '../core/component';
import store from '../store/index';
import LoaderTemplate from "./templates/loader.html";
import CreatorTemplate from "./templates/loader-create.html";
import Recent from './recent';

export default class Loader extends Component {
    constructor(modal) {
        super({
            store 
        });

        this.element = null;
        this.dropArea = null;
        this.dropFiles = null;
        this.modal = modal;
        this.recent = new Recent();
    }
    
    render() {

        let self = this;
        self.log('loader...render');

        if ((store.state.currentState === PB.STATE_LOAD) || (store.state.currentState === PB.STATE_CREATE)) {
            let template = store.state.currentState === PB.STATE_LOAD ? LoaderTemplate : CreatorTemplate;
            if (store.state.error == PB.ERROR.NO_CONTEXT) {
                template = template.replace('\{error\}', '\{error.noContext\}');
            }
            self.modal.content.innerHTML = ''; 
            self.modal.content.insertAdjacentHTML('beforeend', self.localizer.localize(template));
            self.element = DOM.elid('photoblock-loader-wrapper'); 
        
            if (store.state.error !== null) {
                DOM.elid('photoblock-error-message').removeAttribute('style');
            } else {
                DOM.elid('photoblock-greet-message').removeAttribute('style');
                DOM.elid('photoblock-new-message').removeAttribute('style');
            }

            DOM.elid('photoblock-loader-wrapper').className = "photoblock-new";    
            self.dropFiles = DOM.elid("photoblock-files");
            self.dropArea = DOM.elid("photoblock-drop-area");
            self.dropFiles.onchange = (evt) => {
                self.handleFiles(evt.target.files);
            }
 
            if (store.state.currentState === PB.STATE_LOAD) {
                DOM.elid('photoblock-action-create').addEventListener("click", () => {
                    store.dispatch('createPhoto', { });
                });
            } else {
                DOM.elid('photoblock-action-cancel').addEventListener("click", () => {
                    store.dispatch('cancelPhoto', { });
                });
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

            window.setTimeout(() => {
                self.toggleRecent(true);
                self.loadRecents();
            }, 10);
    
        }

    }

    loadRecents() {
        let self = this;
        let scroller = DOM.elid('photoblock-recent-scroll');
        self.recent.all((recents) => {
            if (recents.length === 0) {
                DOM.elid('photoblock-new-message').setAttribute('style', 'display:none;');
                DOM.elid('photoblock-newalt-message').removeAttribute('style');
            }
            for(let r=0; r<recents.length; r++) {
                let item = recents[r];
                let photo = (window.webkitURL || window.URL).createObjectURL(new Blob([item.photo], { type: 'image/jpeg' }));
                window.setTimeout(() => {
                    (window.webkitURL || window.URL).revokeObjectURL(photo);
                }, 100);
                let div = DOM.div(); 
                let img = DOM.img({
                    src: photo,
                    id: item.key
                });
                img.addEventListener('click', (e) => {
                    self.selectRecent(e.target.id);
                });
                if (!item.saved) {  //TODO: Change to item.saved
                    let trash = DOM.img({
                        src: 'img/trash.svg',
                        id: item.key,
                        className: 'trash'
                    });
                    trash.addEventListener('click', (e) => {
                        self.deleteRecent(e.target.id);
                    });
                    div.appendChild(trash);    
                }
                div.appendChild(img);
                scroller.appendChild(div);
            }
        });
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

    selectRecent(key) {
        let self = this;
        self.recent.get(key, (item) => {
            self.recent.updateLastUsed(key, () => {
                store.dispatch('loadPhoto', { imgBuffer: item.photo });
            });
        });
    }

    confirmDeleteRecent(key) {
        let self = this;
        DOM.elid('photoblock-recent-confirm').removeAttribute('style');
    }


    deleteRecent(key) {
        let self = this;
        self.recent.delete(key, () => {
            store.dispatch('cancelPhoto', { });
        });
    }

    toggleRecent(show) {
        let self = this;

        self.dashboard = show || !self.dashboard;
        let dashboardWrapper = DOM.elid('photoblock-recent-wrapper');
        if (dashboardWrapper) {
            dashboardWrapper.className = self.dashboard ? 'photoblock-recent-slide' : '';
        }
        if (self.dashboard) {
        }
    }
}
