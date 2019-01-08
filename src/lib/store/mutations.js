import PB from '../core/constants';


export default {

    setContext(state, payload) {
        state.currentContext = payload.context;
        state.currentState = PB.STATE_INIT;

        return state;
    },

    showModal(state, payload) {
        state.isModalVisible = true;
        if (state.currentState === PB.STATE_INIT) {
            state.currentState = PB.STATE_LOADER;
        }

        return state;
    },

    hideModal(state, payload) {
        state.isModalVisible = false;
        if (state.currentState === PB.STATE_LOCKED) {
            state.photo = {
                imgData: null,
                buffer: null
            }
            state.currentState = PB.STATE_INIT;
        }
        return state;
    },

    loadPhoto(state, payload) {

        state.photo = payload; // { imgData, buffer }
        state.currentState = PB.STATE_LOCKED;
        return state;
    },

    unlock(state, payload) {
        
        state.currentState = PB.STATE_UNLOCKED;
        return state;
    },

    setWallpaper(state, payload) {
        
        state.wallpaper = payload.wallpaper;
        return state;
    },

    setCollectionName(state, payload) {
        
        state.collectionName = payload.collectionName;
        return state;
    }
};
