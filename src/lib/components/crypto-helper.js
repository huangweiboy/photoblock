"use strict";
import PB from '../core/constants';
import blake from 'blakejs';
import bip39 from 'bip39';

export default class CryptoHelper  {

    static getEmojiEntropy(emojiKey) {
        if (emojiKey.length < PB.REQUIRED_EMOJIS) {
            return null;
        }

        let hashes = [];
        let idx = 0;
        emojiKey.map((item, index) => {
            let emojiArray = item.emoji;
            let hash = CryptoHelper.hash(item.emoji);
            hashes.push({ cell: item.cell, hash: hash});

            if (index === (emojiKey.length - 1)) {
                // The index is the last byte of the last emoji item
                idx = emojiArray[emojiArray.length - 1];
            }
        });
        return {
            entropy: hashes,
            index: idx
        }
    }


    static getEntropy(emojiEntropyInfo, imageSliceHashes) {

        let combinedHash = '';
        emojiEntropyInfo.entropy.map((item) => {
            let cell = item.cell;
            let emojiHash = item.hash;
            let imageHash = imageSliceHashes[cell]; // Hash of image for slice referenced by emoji cell (0..8)

            let cellHash = emojiHash + imageHash;
            combinedHash += CryptoHelper.hash(cellHash);

            console.log('Cell/Hash/Slice', cell, emojiHash, imageHash, combinedHash);
        });

        let entropy = CryptoHelper.hash(combinedHash);
        let mnemonic = bip39.entropyToMnemonic(entropy);
        return {
            entropy: entropy,
            index: emojiEntropyInfo.index,
            mnemonic: mnemonic
        }
    }

    static hash(input) {
        return blake.blake2s(input);
    }

    static ui8ArrayToHex(ui8Array) {
        let s = '';
        let h = '0123456789abcdef';
        ui8Array.forEach((v) => { s += h[v >> 4] + h[v & 15]; });
        return s;
      }
}
