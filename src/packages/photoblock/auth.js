'use strict';

import DOM from './core/dom';
import PB from './core/constants';
import store from './store/index';
import PhotoBlockModal from './components/modal';
import Loader from './components/loader';
import EmojiKey from './components/emojikey';
import Download from './components/download';
import Dashboard from './components/dashboard';

import './photoblock.css';

import EthereumContext from '../contexts/ethereum';
import WebContext from '../contexts/web';

export default class PhotoBlockAuth {


  constructor(options) {
    this.options = options || {};
    this.srcUrl = null;
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
    this.handlers[PB.EVENT_TYPES.UNLOCK] = (account) => { console.log(`Account ${Object.values(account)[0]} unlocked.`); };
    this.handlers[PB.EVENT_TYPES.UPDATE] = (account, callback) => { console.log(`Account ${Object.values(account)[0]} update requested.`); callback(`<h1>${Object.values(account)[0]}</h1>`) };
    this.registerContext(EthereumContext);
    this.registerContext(WebContext);

  }




  registerContext(context) {

    let self = this;

    if (self.rendered) {
      throw 'Contexts can only be registered prior to rendering';
    }
    let isValid = false;
    if (context.Name &&
      (context.Name !== '') &&
      !self.contexts[context.Name] &&
      !self.contexts[context.Name.toLowerCase()] &&
      (/^[a-zA-Z()]+$/.test(context.Name)) &&
      context.Attributes &&
      context.Attributes.length &&
      (context.Attributes.length > 0) &&
      (context.Attributes[0].indexOf('\'') !== 0) &&
      (typeof context.Handlers == 'object') &&
      (context.Handlers.hasOwnProperty('generateAccounts')) &&
      (context.Handlers.generateAccounts !== null) &&
      (typeof context.Handlers.generateAccounts == 'function') &&
      (context.Handlers.hasOwnProperty('sign')) &&
      (context.Handlers.sign !== null) &&
      (typeof context.Handlers.sign == 'function')
    ) {
      isValid = true;
      context.Attributes.map((attribute) => {
        if ((attribute === null) || (attribute.length === 0) || !(/^[\'a-zA-Z]+$/.test(attribute))) {
          isValid = false;
        }
      })
      if (isValid) {
        self.contexts[context.Name] = {
          name: context.Name,
          symbol: context.Symbol,
          logoUrl: context.LogoUrl,
          hdPath: context.HdPath,
          count: context.Count || 1,
          attributes: context.Attributes,
          handlers: context.Handlers
        }
        if (context.Handlers.hasOwnProperty('init')) {
          context.Handlers['init']();
        }
      }
    }
    return isValid;
  }

  sign(data, reason, callback) {
    let self = this;
    self.context.handlers.sign(data, reason, callback);
  }

  loadContext = (context, callback) => {

    context = context.substr(0,1).toUpperCase() + context.substr(1).toLowerCase();
    const existingScript = DOM.elid(`${context}Context`);
  
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = ``;
      script.id = existingScript;
      document.body.appendChild(script);
  
      script.onload = () => {
        if (callback) callback();
      };
    }
  
    if (existingScript && callback) callback();
  };

  on(eventType, callback) {
    let self = this;

    if (self.rendered) {
      throw 'Handlers can only be registered prior to rendering';
    }

    if ((callback === null) || (typeof callback !== 'function')) {
      throw 'Handlers require a valid callback function';
    }

    switch (eventType) {
      case PB.EVENT_TYPES.CREATE:
        self.handlers[PB.EVENT_TYPES.CREATE] = callback;
        break;
      case PB.EVENT_TYPES.HIDE:
        self.handlers[PB.EVENT_TYPES.HIDE] = callback;
        break;
      case PB.EVENT_TYPES.LOAD:
        self.handlers[PB.EVENT_TYPES.LOAD] = callback;
        break;
      case PB.EVENT_TYPES.LOCK:
        self.handlers[PB.EVENT_TYPES.LOCK] = callback;
        break;
      case PB.EVENT_TYPES.NEW:
        self.handlers[PB.EVENT_TYPES.NEW] = callback;
        break;
      case PB.EVENT_TYPES.SHOW:
        self.handlers[PB.EVENT_TYPES.SHOW] = callback;
        break;
      case PB.EVENT_TYPES.UNLOCK:
        self.handlers[PB.EVENT_TYPES.UNLOCK] = callback;
        break;
      case PB.EVENT_TYPES.UPDATE:
        self.handlers[PB.EVENT_TYPES.UPDATE] = callback;
        break;
    }
  }

  static eventTypes() {
    return PB.EVENT_TYPES;
  }


  getContextNames() {
    return Object.keys(this.contexts);
  }

  render(contextName, callback) {
    let self = this;
    self.rendered = true;

    if ((self.element == null) || ((self.context !== null) && (contextName !== self.context.name))) {
      if (self.contexts.hasOwnProperty(contextName)) {
        self.context = self.contexts[contextName];

        store.dispatch('ready', {
          context: self.context,
          contexts: self.contexts,
          handlers: self.handlers
        });

        self.modal = new PhotoBlockModal();
        self.loader = new Loader(self.modal);
        self.dashboard = new Dashboard(self.modal);
        self.emojiKey = new EmojiKey(self.modal);
        self.download = new Download(self.modal);
      }

      store.dispatch('showModal', {});
    }

    callback();
  }


}