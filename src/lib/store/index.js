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
        wallpaper: null,
        collectionName: null
    }
});

/*
        photo: {
            imgData: null,
            buffer: null
        },
        options: {},
        emojisChosen: 0,
        emoji: [
            {
                focus: false,
                value: null,
                order: -1
            },
            {
                focus: false,
                value: null,
                order: -1
            },
            {
                focus: false,
                value: null,
                order: -1
            },
            {
                focus: false,
                value: null,
                order: -1
            },
            {
                focus: true,
                value: '1f483-1f3fd',
                order: 0
            },
            {
                focus: false,
                value: null,
                order: -1
            },
            {
                focus: false,
                value: null,
                order: -1
            },
            {
                focus: false,
                value: null,
                order: -1
            },
            {
                focus: false,
                value: null,
                order: -1
            }
        ]*/