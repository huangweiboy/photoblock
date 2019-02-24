'use strict';
import blake from 'blakejs';

export default class CryptoHelper  {

    static hash(input) {
        return blake.blake2s(input);
    }

    static hashHex(input) {
        return blake.blake2sHex(input);
    }

}
