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
        context.commit('loadPhoto', payload)
    },

    unlock(context, payload) {
        context.commit('unlock', payload);
    },

    setWallpaper(context, payload) {
        context.commit('setWallpaper', payload);
    },

    setCollectionName(context, payload) {
        context.commit('setCollectionName', payload);
    }

};
