"use strict";

import DOM from './core/dom.js';
import store from './store/index';
import PhotoBlockModal from './components/modal';
import Loader from './components/loader';
import Locked from './components/locked';
import Unlocked from './components/unlocked';
import Xmp from "./components/xmp";

import photoBlockFrame from "./img/photoblock-frame.svg";
import photoBlockIcon from "./img/photoblock-icon.svg";
import "./photoblock.css";


export default class PhotoBlock {

  constructor(containerId, callback, options) {
    
    this.containerId = containerId;
    this.options = options || {};
    this.element = null;
    this.xmp = new Xmp();
    this.contexts = this.xmp.getPhotoContexts();
    this.modal = null;
    this.loader = null;
    this.locked = null;
    this.unlocked = null;
    this.context = null;
    
    callback(this);
  }

  render(context) {
    let self = this;

    if ((self.element == null) || (context !== self.context.name)) {      
      if (self.contexts.hasOwnProperty(context)) {
        self.context = self.contexts[context];
        store.dispatch('setContext', { context: self.context });
        self.modal = new PhotoBlockModal();
        self.loader = new Loader(self.modal);
        self.locked = new Locked(self.modal);
        self.unlocked = new Unlocked(self.modal);
      }

      self.element = document.querySelector(`#${self.containerId}`);
      self.element.innerHTML = '';
      let wrapper = DOM.div({ className: 'photoblock-wrapper'}); 
      self.element.appendChild(wrapper); 
      wrapper.appendChild(DOM.img({ className: 'photoblock-button photoblock-icon', src: photoBlockIcon, alt: 'PhotoBlock Icon' }));  
      wrapper.appendChild(DOM.img({ className: 'photoblock-button photoblock-frame', src: photoBlockFrame, alt: 'PhotoBlock Frame' }));  

      if (self.currentContext !== null) {
        let buttonElements = wrapper.querySelectorAll(`.photoblock-button`);
        for(let b=0; b<buttonElements.length; b++) {
          buttonElements[b].addEventListener('click', (e) => {
            store.dispatch('showModal', {});
          });
        }   
      } else {
        wrapper.appendChild(DOM.div({ className: 'photoblock-error-context' }, 'Error: No context specified'));
      }
    }  
  }

}
