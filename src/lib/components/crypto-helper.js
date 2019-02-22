"use strict";
import PB from '../core/constants';
import blake from 'blakejs';
import { ethers } from 'ethers';

export default class CryptoHelper  {

    static getEmojiEntropy(emojiKey) {
        if (emojiKey.length < PB.REQUIRED_EMOJIS) {
            return null;
        }

        let hashes = [];
        let idx = 0;
        emojiKey.map((item, index) => {
            console.log('Item.emoji', window.atob(item.emoji), window.atob(item.emoji)[window.atob(item.emoji).length - 1])
            let hash = CryptoHelper.hash(window.atob(item.emoji));
            hashes.push({ cell: item.cell, hash: hash});

            if (index === (emojiKey.length - 1)) {
                // The index is the last byte of the last emoji item
                idx = window.atob(item.emoji)[window.atob(item.emoji).length - 1];
            }
        });
        return {
            entropy: hashes,
            index: idx
        }
    }

    // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
    static getAccount(hdInfo, index) {
        // hdInfo: path, seed, index

        let HDNode = ethers.utils.HDNode;
        let mnemonic = HDNode.entropyToMnemonic(hdInfo.hash);
        console.log('Dynamic mnemonic', mnemonic);
        mnemonic = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat';


        let root = HDNode.fromMnemonic(mnemonic);
        let child = root.derivePath(`${hdInfo.path}/${hdInfo.index}`);

console.log('Private', child.extendedKey);
console.log('Public', child.neuter().extendedKey);

let wallet = ethers.Wallet.fromMnemonic(mnemonic,`${hdInfo.path}/${hdInfo.index}`);
console.log('Wallet', wallet);

}

    static getEntropy(emojiEntropyInfo, imageSliceHashes) {

        let combinedHash = '';
        emojiEntropyInfo.entropy.map((item) => {
            let cell = item.cell;
            let emojiHash = item.hash;
            let imageHash = imageSliceHashes[cell]; // Hash of image for slice referenced by emoji cell (0..8)

            let cellHash = emojiHash + imageHash;
            combinedHash += CryptoHelper.hash(cellHash);

        });
        return {
            hash: CryptoHelper.hash(combinedHash),
            index: emojiEntropyInfo.index
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
