"use strict";
import nacl from 'tweetnacl-blake2b';
import PB from '../core/constants';

export default class IpfsEngine {
  constructor(gateway) {
    this.gateway = gateway;
  }
  
  /**
   * 
   * @param keys Array of strings that will be hashed to see if a collection exists 
   */
  _doesCollectionExist(collectionHash, callback) {
    let self = this;

    let requestInfo = {
      method: 'GET'
    }
    let request = new Request(`${self.gateway}${PB.IPFS_PATHS.COLLECTIONS_DIRECTORY}${collectionHash}.json`, requestInfo)
    fetch(request)
      .then((response) => {
        if (response.status === PB.HTTP_STATUS.OK) {
          return response.json();
        } else {
          return null;
        }
      })
      .then(json => callback(null, json))
      .catch(error => callback(error, null));
  }

  _pinCollection(collectionHash, callback) {
  
    let self = this;

    let requestInfo = {
      method: 'PUT',
      body: JSON.stringify({ hello: "world" })    
    }
    let request = new Request(`${self.gateway}${PB.IPFS_PATHS.COLLECTIONS_DIRECTORY}${collectionHash}.json?pin=true`, requestInfo)
    fetch(request)
      .then((response) => {
        if (response.status === PB.HTTP_STATUS.OK) {
          return response.json();
        } else {
          return null;
        }
      })
      .then(json => callback(null, json))
      .catch(error => callback(error, null));
  }
 
  addCollection(name, wallpaper, firstEmoji, callback) {
    let self = this;

    let collectionHash = self._getCollectionHash(name, wallpaper, firstEmoji);

    self._doesCollectionExist(collectionHash, (error, json) => {
      console.log('Does Collection Exist:', {error}, {json});
      if (json === null) {
        self._pinCollection(collectionHash, (error, json) => {
          console.log('Pin Collection:', {error}, {json});
        });
      }
    });
  }

  _getCollectionHash(name, wallpaper, firstEmoji) {
    let hash = nacl.hash(Uint8Array.from(name + '-' + wallpaper + '-' + firstEmoji));
    return this._bufferToHex(hash);
  }

  _bufferToHex(buffer) {
    let s = '';
    let h = '0123456789abcdef';
    (new Uint8Array(buffer)).forEach((v) => { s += h[v >> 4] + h[v & 15]; });
    return s;
  }

}
 