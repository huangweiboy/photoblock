'use strict';
import PB from '../core/constants';
import CryptoHelper from './crypto-helper';
import DOM from '../core/dom';
import Component from '../core/component';
import store from '../store/index';
import Emoji from './emoji/11/photoblock-emoji';
import EmojiKeyTemplate from "./templates/emojikey.html";
import "./emoji/11/photoblock-emoji.css";

export default class EmojiKey extends Component {
    constructor(modal) {
        super({
            store
        });

        this.element = null;
        this.modal = modal;

        this.focus = 4;
        this.emojiPicker = false;
        this.emojiKey = [];

        this.preloadTabs = document.createElement('div');
        this.preloadEmojis = document.createElement('div');

        // Emoji pre-loader
        window.setTimeout(() => {
            this.preloadEmojiElements();
          },100);
    } 

    // Random Hex: https://www.browserling.com/tools/random-hex

    render() {

        let self = this;
        self.log('emojikey...render');

        if ((store.state.currentState === PB.STATE_NEW) || (store.state.currentState === PB.STATE_DEFINE) || (store.state.currentState === PB.STATE_CONFIRM) || (store.state.currentState === PB.STATE_UNLOCK)){
            self.modal.content.innerHTML = '';
            self.emojiKey = []; //store.state.emojiKey;

            let template = EmojiKeyTemplate;
            switch(store.state.currentState) {
                case PB.STATE_DEFINE:
                    template = EmojiKeyTemplate
                                    .replace('{currentTitle}', '{emojiKey.createTitle}')
                                    .replace('{currentText}', '{emojiKey.create}');
                    break;
                case PB.STATE_CONFIRM:
                    template = EmojiKeyTemplate
                                    .replace('{currentTitle}', '{emojiKey.confirmTitle}')
                                    .replace('{currentText}', '{emojiKey.confirm}');
                    break;
            }

            self.modal.content.insertAdjacentHTML('beforeend', self.localizer.localize(template));
            self.element = DOM.elid('photoblock-photo');  
            if (store.state.photoEngine != null) {
                store.state.photoEngine.getDataUri((img) => {
                    self.element.src = img;                    
                });
            }

            let introSection = DOM.elid('photoblock-emoji-intro');  
            let cellsSection = DOM.elid('photoblock-emoji-cells');  
            let helpSection = DOM.elid('photoblock-emoji-helptext');  

            let backButton = DOM.elid('photoblock-action-back');
            let nextButton = DOM.elid('photoblock-action-next');
            let resetButton = DOM.elid('photoblock-action-reset');

            switch(store.state.currentState) {

                // Intro view
                case PB.STATE_NEW:
                    DOM.elid('photoblock-emoji-create').removeAttribute('style');
                    cellsSection.setAttribute('style', 'display:none;');
                    helpSection.setAttribute('style', 'display:none;');
    
                    backButton.addEventListener('click', () => {
                        store.dispatch('cancelPhoto', {});
                    }); 
    
                    nextButton.removeAttribute('style');
                    nextButton.addEventListener('click', () => {
                        store.dispatch('defineEmojiKey', {});
                    });
    
                    resetButton.id = '';
                    break;

                // Define the emoji
                case PB.STATE_DEFINE:                    
                    DOM.elid('photoblock-emoji-create').removeAttribute('style');
                    backButton.addEventListener('click', () => {
                        store.dispatch('newEmojiKey', {});
                    }); 

                    nextButton.removeAttribute('style');
                    nextButton.addEventListener('click', () => {
                        if (self.emojiKey.length >= PB.REQUIRED_EMOJIS) {
                            store.dispatch('confirmEmojiKey', { emojiKey: self.emojiKey });
                        }
                    });
                    break;

                // Confirm the emoji
                case PB.STATE_CONFIRM:
                    self.emojiKey = [];
                    DOM.elid('photoblock-emoji-create').removeAttribute('style');
                    backButton.addEventListener('click', () => {
                        store.dispatch('defineEmojiKey', {});
                    }); 
                    
                    nextButton.removeAttribute('style');
                    nextButton.addEventListener('click', () => {
                        if (self.emojiKey.length >= PB.REQUIRED_EMOJIS) {
                            if (self.compareEmojiKey()) {
                                store.dispatch('downloadPhoto', {});
                            } else {
                                self.renderCells();                            
                            }
                        }
                    });
                    break;

                // Use emoji to unlock
                case PB.STATE_UNLOCK:
                    self.emojiKey = [];
                    backButton.addEventListener('click', () => {
                        store.dispatch('cancelPhoto', {});
                    }); 

                    let unlockButton = DOM.elid('photoblock-action-unlock');
                    unlockButton.removeAttribute('style');
                    unlockButton.addEventListener('click', () => {
                        store.dispatch('unlock', { emojiKey: self.emojiKey });
                    }); 
    
                    DOM.elid('photoblock-emoji-unlock').removeAttribute('style');

                    if (store.state.unlockCount > 0) {
                        DOM.elid('photoblock-photo-wrapper').setAttribute('style','background-color: #cc0000;');
                        window.setTimeout(() => DOM.elid('photoblock-photo-wrapper').removeAttribute('style'), 3000);
                    }
                    break;
            }

            if (store.state.currentState !== PB.STATE_NEW) {
                introSection.setAttribute('style', 'display:none;');

                self.element.addEventListener('click', () => {
                    self.toggleEmojiPicker();
                });

                resetButton.addEventListener('click', () => {
                    self.focus = 4;
                    self.emojiKey = [];
                    self.render();
                }); 
                
                self.renderCells();
                self.renderPicker();
            }
           
        }        

    } 

    compareEmojiKey() {
        let self = this;
        let current  = self.emojiKey.map((item) => { return String(item.cell) + item.emoji}).join(''); 
        let previous  = store.state.emojiKey.map((item) => { return String(item.cell) + item.emoji}).join(''); 
        return (store.state.emojiKey.length === 0) || (current === previous); 
    }

    renderCells() {
        let self = this;

        // Remove existing cells
        for(let r=0; r<=2; r++) {
            let tr = DOM.elid(`photoblock-emoji-cells-r${String(r)}`);
            tr.innerHTML = '';
        }

        let highlightSuffix = store.state.currentState === PB.STATE_UNLOCK ? 'pass' : 'ready';
        for(let cell=0; cell<9; cell++) {
            let row = DOM.elid('photoblock-emoji-cells-r' + String(Math.floor(cell / 3)));
            let suffix = self.compareEmojiKey() ? highlightSuffix : 'error';
            let td = DOM.td({ className: `photoblock-cell${ self.focus === cell ? ' photoblock-cell-animated' : ''}`});

            // Find if the current cell has an emoji
            let emojiKeyIndex = self.getEmojiKeyIndexForCell(cell);

            // Get the data required for CSS to display the emoji
            let emojiInfo = emojiKeyIndex > -1 ? self.getEmojiInfo(self.emojiKey[emojiKeyIndex].emoji) : null;

            let div = null;
            if (emojiInfo !== null) {
                let badge =  DOM.div({className: `photoblock-cell-badge${store.state.currentState === PB.STATE_UNLOCK || self.emojiKey.length >= PB.REQUIRED_EMOJIS ? ' photoblock-cell-badge-' + suffix : ''}`}, String(emojiKeyIndex+1));
                td.appendChild(badge);
                div = DOM.div({id: `cell-${cell}-${emojiKeyIndex}`, className: `pbemoji-sprite pbemoji-${emojiInfo.categoryKey} pbemoji-${emojiInfo.spriteIndex}`});
                td.appendChild(div);    
            } else {
                div = DOM.div({id: `cell-${cell}-99`, className: 'photoblock-cell-default'});
                td.appendChild(div);    
            }
            row.appendChild(td);

            div.addEventListener('click', self.handleCellSelect.bind(self));
        }

        let unlockButton = DOM.elid('photoblock-action-unlock');        
        let nextButton = DOM.elid('photoblock-action-next');        
        if ((store.state.currentState === PB.STATE_UNLOCK) || ((self.emojiKey.length >= PB.REQUIRED_EMOJIS) && self.compareEmojiKey())) {
            unlockButton.className = 'photoblock-primary-action';
            nextButton.className = 'photoblock-primary-action';
        } else {
            unlockButton.className = 'photoblock-primary-action photoblock-primary-action-disabled';
            nextButton.className = 'photoblock-primary-action photoblock-primary-action-disabled';
        }

    }


    getEmojiKeyIndexForCell(cell) {
        let self = this;
        return self.emojiKey.map((o) => { return o.cell; }).indexOf(cell);
    }
 
    toggleEmojiPicker(show) {
        let self = this;

        self.emojiPicker = show || !self.emojiPicker;
        let emojiWrapper = DOM.elid('photoblock-emoji-wrapper');
        emojiWrapper.className = self.emojiPicker ? 'photoblock-emoji-slide' : '';
    }

    handleCellSelect(e) {
        let self = this;

        self.toggleEmojiPicker(true);

        let cellIndex = parseInt(e.target.id.split('-')[1]);
        if (self.focus == cellIndex) {
            // Selecting same cell clears it
            // Deleting an existing emoji voids all that follow it
            let emojiKeyIndex = self.getEmojiKeyIndexForCell(cellIndex);
            if (emojiKeyIndex > -1) {
                // for(let i=emojiKeyIndex; i<self.emojiKey.length; i++) {
                //     self.enableEmojiIcon(self.emojiKey[i].emoji);
                // }
                self.emojiKey.splice(emojiKeyIndex);
            }            
        }
        
        self.focus = cellIndex;

        self.renderCells();
    }

    preloadEmojiElements() {
        // console.time('Preload Emojis');
        let self = this;
        let memCrypto = store.state.memCrypto;
        Emoji.map((category) => {

            self.preloadTabs.appendChild(DOM.div({ id: `photoblock-emojitab-${category.key}`, className: 'pbemoji-tab', title: `${category.label}` }));

            self.preloadEmojis.appendChild(DOM.div({ id: `photoblock-${category.key}` }));            
            self.preloadEmojis.appendChild(DOM.h3({}, category.label));

            let emojiHtml = '';
            category.items.map((emoji, index) => {
                emojiHtml += `<button id="U${CryptoHelper.hashHex(emoji.code)}" class="pbemoji-sprite pbemoji-${category.key} pbemoji-${index}" title="${emoji.name}"></button>`;
            });

            let div = DOM.div();
            self.preloadEmojis.appendChild(div);
            div.innerHTML = emojiHtml;
        });
       // console.timeEnd('Preload Emojis');
    }

    renderPicker() {
        let self = this;
        let emojiTabsContainer = DOM.elid('photoblock-emoji-tabs');
        emojiTabsContainer.innerHTML = self.preloadTabs.innerHTML;

        let emojiContainer = DOM.elid('photoblock-emoji-scroll');
        emojiContainer.innerHTML = self.preloadEmojis.innerHTML;

        let categories = document.getElementsByClassName('pbemoji-tab');
        for(let c = 0; c < categories.length; c++ ) {
            categories[c].addEventListener('click', self.handleEmojiTabSelect.bind(self));
        }

        let sprites = document.getElementsByClassName('pbemoji-sprite');
        for (let s = 0; s < sprites.length; s++) {
            sprites[s].addEventListener('click', self.handleEmojiSelect.bind(self));
        }

    }

    disableEmojiIcon(code) {
        let emojiIconId = 'U' + code;
        let emojiIcon = DOM.elid(emojiIconId);
        emojiIcon.setAttribute('disabled', 'disabled');
        emojiIcon.setAttribute('style', 'opacity: 0.2;');        
    }

    enableEmojiIcon(code) {
        let emojiIconId = 'U' + code;
        let emojiIcon = DOM.elid(emojiIconId);
        emojiIcon.removeAttribute('disabled');
        emojiIcon.removeAttribute('style');        
    }

    handleEmojiTabSelect(e) {
        let emojiSection = DOM.elid(e.target.id.replace('photoblock-emojitab-', 'photoblock-'));
        emojiSection.parentNode.scrollTop = emojiSection.offsetTop - DOM.elid('photoblock-emoji-tabs').clientHeight;
    }

    handleEmojiSelect(e) {
        let self = this; 

        let emojiCode = e.target.id.substring(1); // Uxxxxxxxxxxxxx
        let emojiKeyIndex = self.getEmojiKeyIndexForCell(self.focus);
        let emojiInfo = {
            cell: self.focus,
            emoji: emojiCode
        }; 

        // Add or replace the emoji for a cell
        if (emojiKeyIndex < 0) {
            self.emojiKey.push(emojiInfo);    
        } else {
            self.emojiKey[emojiKeyIndex] = emojiInfo;
        }

        // Redraw the cells
        self.renderCells();

    

    }

    getEmojiInfo(code) {
        for(let e=0; e<Emoji.length; e++) {
            let category = Emoji[e];
            let index = category.items.map(function(e) { return CryptoHelper.hashHex(e.code); }).indexOf(code);
            if (index > -1) {
                return { categoryKey: category.key, spriteIndex: index };
            }
        };
        return null;
    }

}
