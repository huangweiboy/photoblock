import PB from '../core/constants';
import PhotoEngine from '../components/photo-engine';
import Xmp from '../components/xmp';

export default {
 
    setContext(state, payload, callback) {
        state.contexts = payload.contexts;
        state.currentContext = payload.context;
        state.currentState = PB.STATE_INIT;
        callback(state);
    },

    showModal(state, payload, callback) {
        state.isModalVisible = true;
        if (state.currentState === PB.STATE_INIT) {
            state.currentState = PB.STATE_LOAD;
        }

        callback(state);
    },

    init(state) {
        state.photoEngine = null;
        state.emojiKey = [];
        state.unlockCount = 0;
        state.fresh = false;
        state.currentAccount = null;
    },

    hideModal(state, payload, callback) {
        state.isModalVisible = false;
        if (state.currentState !== PB.STATE_READY) {
            this.init(state);
            state.currentState = PB.STATE_INIT;
        }
        
        callback(state);
    },

    loadPhoto(state, payload, callback) {
        if (payload.imgBuffer !== null) {
            let accounts = Xmp.getAccounts(payload.imgBuffer, state.contexts);
            let hasAccounts = false;
            let hasContextAccount = true;
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
                    state.photoEngine = new PhotoEngine(payload.imgBuffer, state.contexts, accounts[state.currentContext.name][0]);
                    state.currentState = PB.STATE_UNLOCK;
                    callback(state);    
                } else {
                    state.error = PB.ERROR.NO_CONTEXT;
                    callback(state);
                }

            } else {
                state.emojiKey = [];
                state.fresh = false;
                state.photoEngine = new PhotoEngine(payload.imgBuffer, state.contexts, null);
                state.currentState = PB.STATE_NEW;
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
        state.currentAccount = state.photoEngine.unlockPhotoBlock(state.currentContext, payload.emojiKey) 
        if (state.currentAccount !== null) {
            state.currentState = PB.STATE_READY;
            callback(state);
        } else {            
            if (state.unlockCount > PB.MAX_UNLOCK_ATTEMPTS) {
                this.hideModal(state, null, callback);
            } else {
                state.emojiKey = [];
                callback(state);
            }
    
        }
    },

    lock(state, payload, callback) {
        
        this.init(state);
        state.currentState = PB.STATE_LOAD;
        callback(state);
    }

};
