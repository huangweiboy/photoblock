import PB from '../core/constants';
import Xmp from '../components/xmp';
import PhotoEngine from '../components/photo-engine';

export default {
 
    setContext(state, payload, callback) {
        state.currentContext = payload.context;
        state.xmp = new Xmp(payload.context, payload.contexts);
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

    hideModal(state, payload, callback) {
        state.isModalVisible = false;
        if (state.currentState !== PB.STATE_UNLOCKED) {
            state.photoEngine = null;
            state.currentState = PB.STATE_INIT;
        }
        
        callback(state);
    },

    loadPhoto(state, payload, callback) {
        if (payload.imgBuffer !== null) {

            let accounts = state.xmp.getAccounts(payload.imgBuffer, state.currentContext.name);
            if (accounts != null) {
                
                if (accounts[state.currentContext.name].length === 0) {
                    callback(state);
                }
                else {
                    state.emojiKey = [];
                    state.fresh = false;
                    state.photoEngine = new PhotoEngine(payload.imgBuffer, state.xmp, true);
                    state.currentState = PB.STATE_UNLOCK;
                    callback(state);    
                }
            } else {    
                state.emojiKey = [];
                state.fresh = false;
                state.photoEngine = new PhotoEngine(payload.imgBuffer, state.xmp, false);
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

    addContextAccountAndDownload(state, payload, callback) {

        state.photoEngine.createPhotoBlockImage(state.xmp.contexts, () => {
            state.fresh = true;
            state.photoEngine = null;
            state.emojiKey = [];
            state.currentState = PB.STATE_LOAD;
            callback(state);
        });
    },

    cancelPhoto(state, payload, callback) {

        state.photoEngine = null;
        state.emojiKey = [];
        state.currentState = PB.STATE_LOAD;
        callback(state);
    },

    unlock(state, payload, callback) {
        
        state.currentState = PB.STATE_UNLOCKED;
        callback(state);
    }

};
