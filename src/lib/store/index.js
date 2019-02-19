import actions from './actions';
import mutations from './mutations';
import Store from './store';
import PB from '../core/constants';

export default new Store({
    actions,
    mutations,
    state: {
        currentState: PB.STATE_INIT,
        currentContext: null,
        isModalVisible: false,
        emojiKey: [],
        xmp: null,
        photoEngine: null,
        fresh: false
    }

});
