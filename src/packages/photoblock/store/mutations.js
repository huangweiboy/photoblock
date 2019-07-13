import PB from '../core/constants';
import PhotoEngine from '../components/photo-engine';
import Xmp from '../components/xmp';

export default {
 
    ready(state, payload, callback) {
        state.contexts = payload.contexts;
        state.currentContext = payload.context;
        state.handlers = payload.handlers;
        state.currentState = PB.STATE_INIT;
        callback(state);
    },

    navigateAuth(state, payload, callback) {
        location.href = "https://ipfs.auth1.com:8001/auth.html?session=1&context=Ethereum";
    },

    showModal(state, payload, callback) {
        state.isModalVisible = true;
        if (state.currentState === PB.STATE_INIT) {
            state.currentState = PB.STATE_LOAD;
        }
        state.handlers[PB.EVENT_TYPES.SHOW]();    
        callback(state);
    },

    init(state) { 
        state.photoEngine = null;
        state.emojiKey = [];
        state.unlockCount = 0;
        state.fresh = false;
        state.currentAccount = null;
        state.xmpAccounts = null;
    },

    hideModal(state, payload, callback) {
        state.isModalVisible = false;
        if (state.currentState !== PB.STATE_READY) {
            this.init(state);
            state.currentState = PB.STATE_INIT;
        }
        
        state.handlers[PB.EVENT_TYPES.HIDE]();    
        callback(state);
    },

    createPhoto(state, payload, callback) {
        state.currentState = PB.STATE_CREATE;
        callback(state);    
    },

    loadPhoto(state, payload, callback) {
        if (payload.imgBuffer !== null) {
            let accounts = Xmp.getAccounts(payload.imgBuffer, state.contexts);
            let hasAccounts = false;
            let hasContextAccount = false;
            Object.keys(accounts).map((contextName) => {
                if ((accounts[contextName] !== null) && (accounts[contextName].length) && (accounts[contextName].length > 0)){
                    hasAccounts = true;

                    if (contextName === state.currentContext.name) {
                        hasContextAccount = true;
                    }
                }
            });



            if (hasAccounts) {
                if (hasContextAccount) {
                    state.emojiKey = [];
                    state.fresh = false;
                    state.unlockCount = 0;
                    state.xmpAccounts = accounts[state.currentContext.name];
                    state.photoEngine = new PhotoEngine(payload.imgBuffer, state.contexts);
                    state.currentState = PB.STATE_UNLOCK;      
                    state.handlers[PB.EVENT_TYPES.LOAD]();              
                    callback(state);    
                } else {
                    state.error = PB.ERROR.NO_CONTEXT;
                    callback(state);
                }
            } else {
                state.emojiKey = [];
                state.fresh = false;
                state.photoEngine = new PhotoEngine(payload.imgBuffer, state.contexts);
                state.currentState = PB.STATE_NEW;
                state.handlers[PB.EVENT_TYPES.NEW]();              
                callback(state);               
            }

          
        
        }
    },

    newEmojiKey(state, payload, callback) {
        state.currentState = PB.STATE_NEW;

        callback(state);
    },

    defineEmojiKey(state, payload, callback) {
        state.currentState = PB.STATE_DEFINE;

        callback(state);
    },

    confirmEmojiKey(state, payload, callback) {
        state.emojiKey = payload.emojiKey;
        state.currentState = PB.STATE_CONFIRM;

        callback(state);
    },

    downloadPhoto(state, payload, callback) {
        state.currentState = PB.STATE_DOWNLOAD;
        callback(state);
    },

    savePhotoBlock(state, payload, callback) {

        state.photoEngine.createPhotoBlockImage(state.emojiKey, (error) => {
            if (error) {
                callback(state);    
            } else {
                this.init(state);
                state.currentState = PB.STATE_LOAD;
                state.fresh = true;
                state.handlers[PB.EVENT_TYPES.CREATE]();              
                callback(state);    
            }
        });
    },

    cancelPhoto(state, payload, callback) {

        this.init(state);
        state.currentState = PB.STATE_LOAD;
        callback(state);
    },

    unlock(state, payload, callback) {
        
        state.unlockCount++;
        state.currentAccount = state.photoEngine.unlockPhotoBlock(state.currentContext, payload.emojiKey, state.xmpAccounts);
        if (state.currentAccount !== null) {
            state.currentState = PB.STATE_READY;
            state.handlers[PB.EVENT_TYPES.UNLOCK](state.currentAccount);              
            callback(state);
        } else {            
            if (state.unlockCount > PB.MAX_UNLOCK_ATTEMPTS) {
                this.hideModal(state, null, callback);
                callback(state);
            } else {
                state.emojiKey = [];
                callback(state);
            }    
        }
    },

    lock(state, payload, callback) {
        
        this.init(state);
        state.currentState = PB.STATE_LOAD;
        state.handlers[PB.EVENT_TYPES.LOCK]();              
        callback(state);
    }

};
