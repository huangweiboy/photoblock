export default {
    REQUIRED_EMOJIS: 4,
    MAX_UNLOCK_ATTEMPTS: 3,
    EMOJI_VERSION: '11',
    PHOTO_INFO: {
        THUMB_WIDTH: 140,
        THUMB_HEIGHT: 170,
        FRAME_WIDTH: 1400,
        FRAME_HEIGHT: 1900,
        SLICE_ROWS: 170,
        SLICE_HASH_BYTES: 4096,
        BYTES_PER_PIXEL: 4,
        FOOTER_HEIGHT: 230,
        LOGO_SIZE: 120,
        CONTEXT_XPOS: 400,
        CONTEXT_INCREMENT: 150,
        EXPORT_QUALITY: 0.6
    },
    STATE_INIT: 'init',
    STATE_LOAD: 'load',
    STATE_CREATE: 'create',
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
    FILE_NAME_SUFFIX_PLACEHOLDER: 'DEFAULT',
    DEFAULT_FILE_NAME: 'Photoblock (DEFAULT).jpg',
    ERROR: {
        NO_CONTEXT: 'no-context'
    },
    DB: {
        NAME: 'photoblock',
        VERSION: 1,        
    },
    AUTH: {
        TOKEN_DURATION_SECONDS: 3600
    },
    WEB_CONTEXT_NAME: 'Web',
    EVENT_TYPES: {
        CLEAR: 'clear',
        CREATE: 'create',
        HIDE: 'hide',
        LOAD: 'load',
        NEW: 'new',
        SHOW: 'show',
        UNLOCK: 'unlock',
        UPDATE: 'update'
    },
    SETTINGS: {
        WALLPAPER: 'wallpaper'
    },
    DOMAINS: {
        PRIMARY: 'photoblock.org',
        SECONDARY: [
            'gateway.ipfs.io', 'ipfs.io', 'cloudflare-ipfs.com'
        ]
    }
};