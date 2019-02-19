import PB from '../core/constants';
import Xmp from '../components/xmp';
import PhotoEngine from '../components/photo-engine';
import IpfsEngine from '../components/ipfs-engine';
import FileSaver from "file-saver";

export default {
 
    setContext(state, payload, callback) {
        state.currentContext = payload.context;
        state.xmp = new Xmp(payload.context, payload.contexts);
        state.currentState = PB.STATE_INIT;
        // if (payload.gateway !== null) {
        //     state.gateway = payload.gateway;
        // }
        callback(state);
    },

    showModal(state, payload, callback) {
        state.isModalVisible = true;
        if (state.currentState === PB.STATE_INIT) {
            state.currentState = PB.STATE_LOAD;
        }

        callback(state);
    },

    hideModal(state, payload, callback) {
        state.isModalVisible = false;
        if (state.currentState !== PB.STATE_UNLOCKED) {
            state.photoEngine = null;
            state.currentState = PB.STATE_INIT;
        }
        
        callback(state);
    },

    loadPhoto(state, payload, callback) {
        if (payload.imgBuffer !== null) {

            let accounts = state.xmp.getAccounts(payload.imgBuffer, state.currentContext.name);
            if (accounts != null) {
                
                if (accounts[state.currentContext.name].length === 0) {
                    callback(state);
                }
                else {
                    state.emojiKey = [];
                    state.fresh = false;
                    state.photoEngine = new PhotoEngine(payload.imgBuffer, state.xmp, true);
                    state.currentState = PB.STATE_UNLOCK;
                    callback(state);    
                }
            } else {    
                state.emojiKey = [];
                state.fresh = false;
                state.photoEngine = new PhotoEngine(payload.imgBuffer, state.xmp, false);
                state.currentState = PB.STATE_NEW;
                callback(state);               
            }

            // Wipe existing container info
            // state.wallpaperId = null;
            // state.wallpaperHash = null;
            // state.collectionName = '';
        }
    },



    newEmojiKey(state, payload, callback) {
        state.currentState = PB.STATE_NEW;

        callback(state);
    },

    defineEmojiKey(state, payload, callback) {
        state.currentState = PB.STATE_DEFINE;

        callback(state);
    },

    confirmEmojiKey(state, payload, callback) {
        state.emojiKey = payload.emojiKey;
        state.currentState = PB.STATE_CONFIRM;

        callback(state);
    },

    downloadPhoto(state, payload, callback) {
        state.currentState = PB.STATE_DOWNLOAD;
        callback(state);
    },


    addContextAccountAndDownload(state, payload, callback) {

        state.photoEngine.createPhotoBlockImage(state.xmp.contexts, () => {
            state.fresh = true;
            state.photoEngine = null;
            state.emojiKey = [];
            state.currentState = PB.STATE_LOAD;
            callback(state);
        })

        // let buffer = this._uri2array(state.photo, true);
        // let contextHandler = state.currentContext.handler;
        // let blob = state.xmp.addAccount(buffer, state.currentContext.name, { address: '0x12333333333333', publicKey: '12345678901234567890' });
        // callback(state);
    },

    cancelPhoto(state, payload, callback) {

        state.photoEngine = null;
        state.emojiKey = [];
        state.currentState = PB.STATE_LOAD;
        callback(state);
    },

    unlock(state, payload, callback) {
        
        state.currentState = PB.STATE_UNLOCKED;
        callback(state);
    },

    __createCollection(state, payload, callback) {
        state.currentState = PB.STATE_CREATE;
        callback(state);
    },

    __saveCollection(state, payload, callback) {
        state.currentState = PB.STATE_SAVE;
        state.collectionName = payload.collectionName;
        let ipfsEngine = new IpfsEngine(state.gateway);
        ipfsEngine.addCollection(state.collectionName, state.wallpaperHash, state.emojiKey[0].emoji, (error, json) => {
            console.log('Save Collection result', {error}, {json});
            callback(state);
        });
    },

    __setWallpaper(state, payload, callback) {   
        state.wallpaperId = payload.wallpaperId;
        state.wallpaperHash = payload.wallpaperHash;
        callback(state);
    },

    __uploadToIPFS(buffer) {
        const xhr = new XMLHttpRequest();
        let gateway = 'https://ipfs.photoblock.org/ipfs';
        let emptyPathHash = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn';
        emptyPathHash = 'QmcqWCi4ytGFZ4wkrThnPmChVz5p92rmWPpAYwxG4QVV3d';
        emptyPathHash = 'QmZnWUL5V451Yh3pGaF7U19h4GqUdUyLesYcB9bgMmPcdf';
        xhr.open('PUT', `${gateway}/${emptyPathHash}/test2.json?pin=true`, true);
        xhr.responseType = 'arraybuffer';
        xhr.timeout = 3600000;
        xhr.onreadystatechange = function onreadystatechange() {
            if (this.readyState === this.HEADERS_RECEIVED) {
                let fileId = xhr.getResponseHeader('Ipfs-Hash');
                console.log('fileId', fileId);
            }
        };
        xhr.addEventListener('error', (e) => {
            console.log('error', e);
        });
        xhr.upload.onprogress = function onprogress(e) {
            if (e.lengthComputable) {
                const per = Math.round((e.loaded * 100) / e.total);
                console.log('progress', per);
            }
        };
        xhr.send(Buffer(JSON.stringify({ x: 'abcd', y: 2 })));
        //xhr.send(new Blob([buffer]));
    }

};
