"use strict";
import PB from '../core/constants';
import DOM from '../core/dom';
import Component from '../core/component';
import Wallpaper from './wallpaper/wallpaper';
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
        this.wallpaperPicker = false;
    }
    
    render() {

        let self = this;
        self.log('loader..render');
 
        if (store.state.currentState === PB.STATE_LOADER) {
            self.modal.content.innerHTML = '';
            self.modal.content.insertAdjacentHTML('beforeend', self.localizer.localize(LoaderTemplate));
            self.element = DOM.elid('photoblock-drop-area');
    
            self.dropFiles = DOM.elid("photoblock-files");
            self.dropArea = DOM.elid("photoblock-drop-area");
            self.dropFiles.onchange = (evt) => {
                self.handleFiles(evt.target.files);
            }
            
            // Wallpaper button
            let wallpaperButton = DOM.elid('photoblock-action-wallpaper');
            wallpaperButton.addEventListener('click', () => {
                self.toggleWallpaperPicker(true);
            }); 

            // Wallpaper close button
            let wallpaperCloseButton = DOM.elid('photoblock-wallpaper-close');
            wallpaperCloseButton.addEventListener('click', () => {
                self.toggleWallpaperPicker();
            }); 
            

            // Prevent default drag behaviors
            ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
                self.dropArea.addEventListener(eventName, function(e) { self.preventDefaults(e); }, false);
                document.body.addEventListener(eventName, self.preventDefaults, false);
            });
    
            // Highlight drop area when item is dragged over it
            ["dragenter", "dragover"].forEach(eventName => {
                self.dropArea.addEventListener(eventName, function() { self.highlight(); }, false);
            });
    
            ["dragleave", "drop"].forEach(eventName => {
                self.dropArea.addEventListener(eventName, function() { self.unhighlight(); }, false);
            });
    
            // Handle dropped files
            self.dropArea.addEventListener("drop", function(e) { self.handleDrop(e); }, false);

            let collectionInput = DOM.elid('photoblock-collection');
            collectionInput.oninput = self.setPrimaryActionState;
            collectionInput.value = store.state.collectionName;
            self.setPrimaryActionState();
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

    toggleWallpaperPicker(show) {
        let self = this;

        self.wallpaperPicker = show || !self.wallpaperPicker;
        let wallpaperWrapper = DOM.elid('photoblock-wallpaper-wrapper');
        wallpaperWrapper.className = self.wallpaperPicker ? 'photoblock-wallpaper-slide' : '';

        self.renderWallpaperPicker();
    }


    renderWallpaperPicker() {
        let self = this;
        //let wallpaperTabsContainer = DOM.elid('photoblock-wallpaper-tabs');
        let wallpaperContainer = DOM.elid('photoblock-wallpaper-scroll');
        if (wallpaperContainer.innerHTML == '') {

            let artworkHtml = '';
            Wallpaper.map((artwork) => {
                artworkHtml += `<img id="${artwork.id}" class="photoblock-wallpaper-item" src="${artwork.preview}" />`;
            });  
            wallpaperContainer.innerHTML = artworkHtml;      
            let artwork = document.getElementsByClassName('photoblock-wallpaper-item');
            for (let a = 0; a < artwork.length; a++) {
                artwork[a].addEventListener('click', self.handleWallpaperSelect.bind(self));
            }
        }
    }

    handleWallpaperSelect(e) {
        let self = this; 
        self.toggleWallpaperPicker();
        self.setWallpaper(e.target.id);
    }

    setWallpaper(wallpaperId) {
        store.dispatch('setWallpaper', { wallpaper: wallpaperId});
    }

    processFile(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (event) {
            let dataURI = event.target.result;

            // Use fetch API to convert dataURI to ArrayBuffer
            fetch(dataURI)
                .then((res) => res.arrayBuffer())
                .then((buffer) => {
                    store.dispatch('loadPhoto', {  imgData: dataURI, buffer: buffer });
                });

        }
    }

    setPrimaryActionState() {
        let collectionName = DOM.elid('photoblock-collection');
        console.log(collectionName.value);
        let nextButton = DOM.elid('photoblock-action-next');
        if ((collectionName.value.length >= 3) && (store.state.wallpaper !== null)) {
            nextButton.className = 'photoblock-primary-action';
        } else {
            nextButton.className = 'photoblock-primary-action photoblock-primary-action-disabled';
        }
    }
}
