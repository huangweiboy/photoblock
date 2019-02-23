"use strict";
import PB from '../core/constants';
import blake from 'blakejs';

export default class CryptoHelper  {

    static hash(input) {
        return blake.blake2s(input);
    }

}
