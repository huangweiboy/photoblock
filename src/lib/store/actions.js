export default {

    setContext(context, payload) {
        context.commit('setContext', payload);
    },

    showModal(context, payload) {
        context.commit('showModal', payload);
    },

    hideModal(context, payload) {
        context.commit('hideModal', payload);
    },

    loadPhoto(context, payload) { 
        context.commit('loadPhoto', payload);
    },

    newEmojiKey(context, payload) {
        context.commit('newEmojiKey', payload);
    },

    defineEmojiKey(context, payload) {
        context.commit('defineEmojiKey', payload);
    },

    confirmEmojiKey(context, payload) {  
        context.commit('confirmEmojiKey', payload);
    },

    downloadPhoto(context, payload) {  
        context.commit('downloadPhoto', payload); 
    },

    cancelPhoto(context, payload) {  
        context.commit('cancelPhoto', payload);
    },

    savePhotoBlock(context, payload) {
        context.commit('savePhotoBlock', payload);
    },

    unlock(context, payload) {  
        context.commit('unlock', payload);
    }

};
