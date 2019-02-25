import actions from './actions';
import mutations from './mutations';
import Store from './store';
import PB from '../core/constants';

export default new Store({
    actions,
    mutations,
    state: {
        currentState: PB.STATE_INIT,
        contexts: null,
        currentContext: null,
        currentAccount: null,
        isModalVisible: false,
        unlockCount: 0,
        emojiKey: [],
        photoEngine: null,
        fresh: false,
        error: null
    }

});
