"use strict";
import DOM from '../core/dom.js';
import Component from '../core/component';
import store from '../store/index';
import ModalTemplate from './templates/modal.html';
import Wallpaper from './wallpaper/wallpaper';


export default class Modal extends Component {
  constructor() {
    super({
      store
    })

    this.element = null;
    this.lastFocusedElement = null;
    this.content = null;
  }
  
  render() {
    let self = this;
    self.log('modal..render');

    if (self.element === null) {

      document.body.insertAdjacentHTML('beforeend', ModalTemplate);
      self.element = DOM.elid('photoblock-modal');
      self.content = DOM.elid('photoblock-inner-content');

      // Keyboard handler 
      self.element.addEventListener('keydown', e => {
      
        if (store.state.isModalVisible === true) {
          if (e.keyCode === 9) {  // Listen for the Tab key
            if (e.shiftKey) { // If Shift + Tab
              // If the current element in focus is the first focusable element within the modal window...
              if (document.activeElement === self.firstTabStop) {
                e.preventDefault();           
                self.lastTabStop.focus(); // ...jump to the last focusable element
              }
            } else {
              // If the current element in focus is the last focusable element within the modal window...
              if (document.activeElement === self.lastTabStop) {
                e.preventDefault();           
                self.firstTabStop.focus(); // ...jump to the first focusable element
              }
            }
          }
          // Close the window by pressing the Esc-key
          if(e.keyCode === 27) {
            store.dispatch('hideModal', {});
          }
        }        
      });
  
      // Close button in modal window
      let closeButton = DOM.elid('photoblock-close-button');
      closeButton.addEventListener('click', () => {
        store.dispatch('hideModal', {});
      });

    }

    if (store.state.isModalVisible === true) {
      DOM.elid('photoblock-context').setAttribute('style', `background-image:url("img/contexts/${store.state.currentContext.name}.svg")`);

      self.lastFocusedElement = document.activeElement;
      // Find all focusable children
      self.focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
      self.focusableElements = self.element.querySelectorAll(self.focusableElementsString);
      self.focusableElements = Array.prototype.slice.call(self.focusableElements); // Convert NodeList to Array
      self.firstTabStop = self.focusableElements[0];  // The first focusable element within the modal window
      self.lastTabStop = self.focusableElements[self.focusableElements.length - 1];  // The last focusable element within the modal window
      self.firstTabStop.focus(); // Focus the window
    } 
    
    self.displayWallpaper();
  }

  displayWallpaper() {
    let self = this;
    if (store.state.wallpaper !== null) {
      let wallpaperIndex = Wallpaper.map((w) => { return w.id; }).indexOf(store.state.wallpaper);
      self.element.setAttribute('style', `display: ${store.state.isModalVisible ? 'flex' : 'none'}; background-image: url("${Wallpaper[wallpaperIndex].wallpaper}")`);  
    } else {
      self.element.setAttribute('style', `display: ${store.state.isModalVisible ? 'flex' : 'none'}")`);  
    }
  }
}


