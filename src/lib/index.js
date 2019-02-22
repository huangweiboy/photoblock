'use strict';

import DOM from './core/dom.js';
import store from './store/index';
import PhotoBlockModal from './components/modal';
import Loader from './components/loader';
import EmojiKey from './components/emojikey';
import Download from './components/download';
import Unlocked from './components/unlocked';

import photoBlockFrame from './img/photoblock-frame.svg';
import photoBlockIcon from './img/photoblock-icon.svg';
import './photoblock.css';

import EthereumContext from './contexts/ethereum/ethereum-context';
import BitcoinContext from './contexts/bitcoin/bitcoin-context';
import WebContext from './contexts/web/web-context';


const RESTRICTED_CONTEXTS = 'app;ethereum;bitcoin;';


export default class PhotoBlock {

  constructor(containerId, options) {
    this.containerId = containerId;
    this.options = options || {};
    this.element = null;
    this.modal = null;
    this.loader = null;
    this.unlocked = null;
    this.emojiKey = null;
    this.download = null;
    this.contexts = {};
    this.context = null;
    this.rendered = false;

    // Built-in handlers
    this.enableContextRegistration = true;

    this.registerContext('Ethereum', 'ETH', 'm/44\'/60\'/0\'/0', ['address', 'publicKey'], { 
      getAccount: (hdInfo) => EthereumContext.getAccount(hdInfo),
      sign: function(entropy, index, data, message) {

      }      
    });

    this.registerContext('Bitcoin', 'BTC', 'm/44\'/0\'/0\'/0', ['address', 'publicKey'], { 
      getAccount: (hdInfo) => BitcoinContext.getAccount(hdInfo),
      sign: function(entropy, index, data) {

      }      
    });

    this.registerContext('Web', null, 'm/44\'/60\'/255\'/255', ['username', 'userId', 'publicKey'], { 
      getAccount: (hdInfo) => WebContext.getAccount(hdInfo),
      sign: function(entropy, index, data) {

      }      
    });

    this.enableContextRegistration = false;

  }

  registerContext(contextName, symbol, hdPath, attributes, handlers) {

    let self = this;

    if (!self.enableContextRegistration) {
      // No technical reason for this...will be enabled in the future when
      // there is proper documentation and a process to ensure dependencies
      // such as icons and handlers can be validated.
      throw 'Context registration by external callers is not currently supported';
    }

    if (self.rendered) {
      throw 'Contexts can only be registered prior to rendering';
    }

    let isValid = false;
    if (contextName 
      && (contextName !== '') 
      && !this.contexts[contextName] 
      && !this.contexts[contextName.toLowerCase()] 
      && (/^[a-zA-Z()]+$/.test(contextName)) 
      && attributes
      && attributes.length 
      && (attributes.length > 0) 
      && (typeof handlers == 'object')
      && (handlers.hasOwnProperty('getAccount'))
      && (typeof handlers.getAccount == 'function')
      && (handlers.hasOwnProperty('sign'))
      && (typeof handlers.sign == 'function')      
      ) {
      isValid = true;
      attributes.map((attribute) => {
        if ((attribute === null) || (attribute.length === 0) || !(/^[a-zA-Z()]+$/.test(attribute))) {
          isValid = false;
        }
      })
      if (isValid) {
        this.contexts[contextName] = {
          name: contextName,
          symbol: symbol,
          hdPath: hdPath,
          attributes: attributes,
          accounts: [],
          handlers: handlers
        }
      }

    }
    return isValid;
  }

  unregisterContext(contextName) {
    let self = this;
    if (self.rendered) {
      throw 'Contexts can only be unregistered prior to rendering';
    }

    if (!this.contexts.hasOwnProperty(contextName)) {
      return false;
    }
    if (RESTRICTED_CONTEXTS.indexOf(contextName.toLowerCase() + ';') > -1) return;
    delete this.contexts[contextName];
    return true;
  }

  getContextNames() {
    return Object.keys(this.contexts);
  }

  render(context) {
    let self = this;
    self.rendered = true;

    if ((self.element == null) || ((self.context !== null) && (context !== self.context.name))) {      
      if (self.contexts.hasOwnProperty(context)) {
        self.context = self.contexts[context];
        store.dispatch('setContext', { context: self.context, contexts: self.contexts });

        self.modal = new PhotoBlockModal();
        self.loader = new Loader(self.modal);
        self.unlocked = new Unlocked(self.modal);
        self.emojiKey = new EmojiKey(self.modal);
        self.download = new Download(self.modal);
      }

      self.element = document.querySelector(`#${self.containerId}`);
      self.element.innerHTML = '';
      let wrapper = DOM.div({ id: 'photoblock-widget-wrapper'}); 
      self.element.appendChild(wrapper); 
      wrapper.appendChild(DOM.img({ id: 'photoblock-widget-icon', className: 'photoblock-button', src: photoBlockIcon, alt: 'PhotoBlock Icon' }));  
      wrapper.appendChild(DOM.img({ id: 'photoblock-widget-frame', className: 'photoblock-button', src: photoBlockFrame, alt: 'PhotoBlock Frame' }));  

      if (self.context !== null) {
        let buttonElements = wrapper.querySelectorAll(`.photoblock-button`);
        for(let b=0; b<buttonElements.length; b++) {
          buttonElements[b].addEventListener('click', (e) => {
            store.dispatch('showModal', {});
          });
        }   
      } else {
        wrapper.appendChild(DOM.div({ className: 'photoblock-error-message' }, 'Error: No context specified'));
      }
    }  
  }

}
