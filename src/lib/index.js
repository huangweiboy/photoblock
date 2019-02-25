'use strict';

import DOM from './core/dom';
import PB from './core/constants';
import store from './store/index';
import PhotoBlockModal from './components/modal';
import Loader from './components/loader';
import EmojiKey from './components/emojikey';
import Download from './components/download';
import Dashboard from './components/dashboard';

import photoBlockFrame from './img/photoblock-frame.svg';
import photoBlockIcon from './img/photoblock-icon.svg';
import './photoblock.css';

import EthereumContext from './contexts/ethereum/ethereum-context';
import BitcoinContext from './contexts/bitcoin/bitcoin-context';
import WebContext from './contexts/web/web-context';


const RESTRICTED_CONTEXTS = PB.BUILTIN_CONTEXTS.bitcoin.toLowerCase() + ';' + PB.BUILTIN_CONTEXTS.ethereum.toLowerCase() + ';' + PB.BUILTIN_CONTEXTS.web.toLowerCase() + ';';


export default class PhotoBlock {

  
  constructor(containerId, options, callback) {
    this.containerId = containerId;
    this.options = options || {};
    this.element = null;
    this.modal = null;
    this.loader = null;
    this.dashboard = null;
    this.emojiKey = null;
    this.download = null;
    this.contexts = {};
    this.context = null;
    this.rendered = false;
    this.handlers = {};
    this.handlers[PB.EVENT_TYPES.CREATE] = () => {};
    this.handlers[PB.EVENT_TYPES.HIDE] = () => {};
    this.handlers[PB.EVENT_TYPES.LOAD] = () => {};
    this.handlers[PB.EVENT_TYPES.LOCK] = () => {};
    this.handlers[PB.EVENT_TYPES.NEW] = () => {};
    this.handlers[PB.EVENT_TYPES.SHOW] = () => {};
    this.handlers[PB.EVENT_TYPES.UNLOCK] = () => {};
  
    // Built-in handlers

    this.registerContext(PB.BUILTIN_CONTEXTS.ethereum, 'ETH', `img/contexts/${PB.BUILTIN_CONTEXTS.ethereum.toLowerCase()}.png`, 'm/44\'/60\'/0\'/0', ['address'], { 
        generateAccounts: (hdInfo, count) => EthereumContext.generateAccounts(hdInfo, count),
        updateDashboard: (account, callback) => EthereumContext.updateDashboard(account, callback),
        sign: (data, reason, callback) => EthereumContext.sign(data, reason, callback)
    });

    this.registerContext(PB.BUILTIN_CONTEXTS.bitcoin, 'BTC', `img/contexts/${PB.BUILTIN_CONTEXTS.bitcoin.toLowerCase()}.png`, 'm/44\'/0\'/0\'/0', ['address'], { 
        generateAccounts: (hdInfo, count) => BitcoinContext.generateAccounts(hdInfo, count),
        updateDashboard: (account, callback) => BitcoinContext.updateDashboard(account, callback),
        sign: (data, reason, callback) => BitcoinContext.sign(data, reason, callback)
    });

    this.registerContext(PB.BUILTIN_CONTEXTS.web, null, `img/contexts/${PB.BUILTIN_CONTEXTS.web.toLowerCase()}.png`, 'm/44\'/60\'/255\'/255', ['userId', 'name', 'publicKey'], { 
        generateAccounts: (hdInfo, count) => WebContext.generateAccounts(hdInfo, count),
        updateDashboard: (account, callback) => WebContext.updateDashboard(account, callback),
        sign: (data, reason, callback) => WebContext.sign(data, reason, callback)
    });

  }


  registerContext(contextName, symbol, imageUrl, hdPath, attributes, handlers) {

    let self = this;

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
      && (handlers.hasOwnProperty('generateAccounts'))
      && (handlers.generateAccounts !== null)
      && (typeof handlers.generateAccounts == 'function')
      && (handlers.hasOwnProperty('updateDashboard'))
      && (handlers.updateDashboard !== null)
      && (typeof handlers.updateDashboard == 'function')
      && (handlers.hasOwnProperty('sign'))
      && (handlers.sign !== null)
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
          imageUrl: imageUrl,
          hdPath: hdPath,
          attributes: attributes,
          handlers: handlers
        }
      }

    }
    return isValid;
  }

  sign(data, reason, callback) {
    let self = this;
    self.context.handlers.sign(data, reason, callback);
  }

  on(eventType, callback) {
    let self = this;

    if (self.rendered) {
      throw 'Handlers can only be registered prior to rendering';
    }

    if ((callback === null) || (typeof callback !== 'function')) {
      throw 'Handlers require a valid callback function';
    }

    switch(eventType) {
      case PB.EVENT_TYPES.CREATE: self.handlers[PB.EVENT_TYPES.CREATE] = callback; break;
      case PB.EVENT_TYPES.HIDE: self.handlers[PB.EVENT_TYPES.HIDE] = callback; break;
      case PB.EVENT_TYPES.LOAD: self.handlers[PB.EVENT_TYPES.LOAD] = callback; break;
      case PB.EVENT_TYPES.LOCK: self.handlers[PB.EVENT_TYPES.LOCK] = callback; break;
      case PB.EVENT_TYPES.NEW: self.handlers[PB.EVENT_TYPES.NEW] = callback; break;
      case PB.EVENT_TYPES.SHOW: self.handlers[PB.EVENT_TYPES.SHOW] = callback; break;
      case PB.EVENT_TYPES.UNLOCK: self.handlers[PB.EVENT_TYPES.UNLOCK] = callback; break;
    }
  }

  static eventTypes() {
    return PB.EVENT_TYPES;
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

  render(context, callback) {
    let self = this;
    self.rendered = true;

    if ((self.element == null) || ((self.context !== null) && (context !== self.context.name))) {      
      if (self.contexts.hasOwnProperty(context)) {
        self.context = self.contexts[context];

        store.dispatch('ready', { context: self.context, contexts: self.contexts, handlers: self.handlers });

        self.modal = new PhotoBlockModal();
        self.loader = new Loader(self.modal);
        self.dashboard = new Dashboard(self.modal);
        self.emojiKey = new EmojiKey(self.modal);
        self.download = new Download(self.modal);
      }

      self.element = document.querySelector(`#${self.containerId}`);
      self.element.innerHTML = '';
      let wrapper = DOM.div({ id: 'photoblock-widget-wrapper'}); 
      self.element.appendChild(wrapper); 
      wrapper.appendChild(DOM.img({ id: 'photoblock-widget-photo', className: 'photoblock-button' }));  
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
    callback();
  }

}
