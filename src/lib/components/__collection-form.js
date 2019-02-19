"use strict";
import PB from '../core/constants';
import DOM from '../core/dom';
import Component from '../core/component';
//import Wallpaper from './wallpaper/__wallpaper';
import store from '../store/index';
import CollectionFormTemplate from "./templates/collection-form.html";

export default class CollectionForm extends Component {
    constructor() {
        super({
            store
        });

        this.element = null;
        this.wallpaperPicker = false;
        this.collectionName = store.state.collectionName;
    }
    
    render() {

        let self = this;
        self.log('collection-form...render');

        if ((store.state.currentState === PB.STATE_LOAD) || (store.state.currentState === PB.STATE_CREATE)) {
            self.element = DOM.elid('photoblock-collection-wrapper');
            if (self.element) {
                let template = CollectionFormTemplate;
                if (store.state.currentState === PB.STATE_LOAD) {
                    template = template.replace('view.collectionIntro', 'loader.collectionIntro');
                } else {
                    template = template.replace('view.collectionIntro', 'emojiKey.collectionIntro');
                }
                self.element.insertAdjacentHTML('beforeend', self.localizer.localize(template));

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
                
                DOM.elid('photoblock-collection-name').oninput = self.validateForm;
                DOM.elid('photoblock-collection-name').value = self.collectionName;
            }
            self.validateForm();    
        }


    }

    validateForm() {

        let self = this;
        let isNameValid = false;
        let isWallpaperValid = false;
        let collectionInput = DOM.elid('photoblock-collection-name');
        
        if (collectionInput !== null) {
            self.collectionName = collectionInput.value || '';
            let nextButton = DOM.elid('photoblock-action-next');
            let wallpaperButton = DOM.elid('photoblock-action-wallpaper');
            if (collectionInput.value.length >= 5) {
                collectionInput.className = 'photoblock-form-collection-valid';
                isNameValid = true;
            } else {
                isNameValid = false;
                if (collectionInput.value.length === 0) {
                    collectionInput.className = '';
                } else {
                    collectionInput.className = 'photoblock-form-collection-invalid';
                }
            }

            if (store.state.wallpaperId !== null) {
                isWallpaperValid = true;
                wallpaperButton.className = 'photoblock-form-collection-valid';
            } else {
                isWallpaperValid = false;
                if (collectionInput.value.length > 0) {
                    wallpaperButton.className = 'photoblock-form-collection-invalid';
                } else {
                    wallpaperButton.className = '';
                }         
            }

            if (isNameValid && isWallpaperValid) {
                nextButton.className = 'photoblock-primary-action';
            } else {
                nextButton.className = 'photoblock-primary-action photoblock-primary-action-disabled';
            }
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
                artworkHtml += `<div id="${artwork.id}" data-hash="${artwork.hash}" class="photoblock-wallpaper-item" style="background-image:url('${store.state.gateway}${PB.IPFS_PATHS.WALLPAPER_DIRECTORY}thumbs/${artwork.id}.jpg');"></div>`;
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
        store.dispatch('setWallpaper', { wallpaperId: e.target.id, wallpaperHash: e.target.dataset.hash });
    }

}
