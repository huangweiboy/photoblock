export default {
    showModal(state, payload) {
        state.isModalVisible = true;

        return state;
    },
    hideModal(state, payload) {
        state.isModalVisible = false;

        return state;
    }
};
