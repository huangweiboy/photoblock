export default {

    showModal(context, payload) {
        context.commit('showModal', payload);
    },
    hideModal(context, payload) {
        context.commit('hideModal', payload);
    }
};
