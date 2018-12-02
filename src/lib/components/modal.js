"use strict";
import DOM from '../core/dom.js';
import Component from '../core/component';
import store from '../store/index';
import ModalTemplate from '../templates/modal.html';
import PhotoBlockUpload from './upload';

export default class PhotoBlockModal extends Component {
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
    self.log('photoblockmodal..render');

    if (self.element === null) {

      document.body.insertAdjacentHTML('beforeend', ModalTemplate);
      self.element = DOM.elid('photoblock-modal');
      self.content = DOM.elid('photoblock-modal-content');
  
  
      self.element.addEventListener('keydown', e => {
      
        if (store.state.isModalVisible) {
          self.log('handler for keydown ');
          if (e.keyCode === 9) {  // Listen for the Tab key
            if (e.shiftKey) { // If Shift + Tab
              // If the current element in focus is the first focusable element within the modal window...
              if (document.activeElement === firstTabStop) {
                e.preventDefault();           
                lastTabStop.focus(); // ...jump to the last focusable element
              }
            } else {
              // If the current element in focus is the last focusable element within the modal window...
              if (document.activeElement === lastTabStop) {
                e.preventDefault();           
                firstTabStop.focus(); // ...jump to the first focusable element
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
      let closeButton = DOM.elid('photoblock-modal-close');
      closeButton.addEventListener('click', () => {
        store.dispatch('hideModal', {});
      });

    }

    if (store.state.isModalVisible === true) {
      self.lastFocusedElement = document.activeElement;
      // Find all focusable children
      let focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
      let focusableElements = self.element.querySelectorAll(focusableElementsString);
      
      focusableElements = Array.prototype.slice.call(focusableElements); // Convert NodeList to Array
      let firstTabStop = focusableElements[0];  // The first focusable element within the modal window
      let lastTabStop = focusableElements[focusableElements.length - 1];  // The last focusable element within the modal window
      firstTabStop.focus(); // Focus the window

      self.element.style.display = 'flex';
    } else {
      self.element.style.display = 'none';
    }


  }

}


