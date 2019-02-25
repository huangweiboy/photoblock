export default {
    EMOJI_VERSION: '11',
    BUILTIN_CONTEXTS: {
        bitcoin: 'Bitcoin',
        ethereum: 'Ethereum',
        web: 'Web'
    },
    PHOTO_INFO: {
        FRAME_WIDTH: 1400,
        FRAME_HEIGHT: 1900,
        WIDTH: 1320, 
        HEIGHT: 1520,
        SLICE_ROWS: 170,
        SLICE_HASH_BYTES: 4096,
        BYTES_PER_PIXEL: 4
    },
    STATE_INIT: 'init',
    STATE_LOAD: 'load',
    STATE_NEW: 'new',
    STATE_DEFINE: 'define',
    STATE_CONFIRM: 'confirm',
    STATE_DOWNLOAD: 'download',
    STATE_CREATE: 'create',
    STATE_SAVE: 'save',
    STATE_UNLOCK: 'unlock',
    STATE_READY: 'ready',
    STATE_FIND: 'find',
    STATE_BROWSE: 'browse',
    REQUIRED_EMOJIS: 2,
    MAX_UNLOCK_ATTEMPTS: 3,
    FILE_NAME_SUFFIX_PLACEHOLDER: 'DEFAULT',
    DEFAULT_FILE_NAME: 'Photoblock (DEFAULT).jpg',
    ERROR: {
        NO_CONTEXT: 'no-context'
    },
    EVENT_TYPES: {
        CLEAR: 'clear',
        CREATE: 'create',
        HIDE: 'hide',
        LOAD: 'load',
        NEW: 'new',
        SHOW: 'show',
        UNLOCK: 'unlock'
    }
};