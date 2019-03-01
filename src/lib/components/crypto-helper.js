'use strict';
import blake from 'blakejs';
import {
    instantiateSecp256k1,
    instantiateSha256,
    instantiateRipemd160,
    binToHex,
    hexToBin
} from 'bitcoin-ts';

export default class CryptoHelper  {

    static MAP = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    static MAINNET_PUBLIC = 0;
    static TESTNET_PUBLIC = 111;
    static WIF_MAINNET_PRIVATE = 128;
    static WIF_TESTNET_PRIVATE = 239;


    constructor() {
        this.secp256k1 = null;
        this.sha256 = null;
        this.ripemd160 = null;
    }

    static hash(input) {
        return blake.blake2s(input);
    }

    static hashHex(input) {
        return blake.blake2sHex(input);
    }

    static toBase58 = function (B) {
        var d = [], s = "", i, j, c, n;
        for (i in B) { j = 0, c = B[i]; s += c || s.length ^ i ? "" : 1;
            while (j in d || c) { n = d[j]; n = n ? n * 256 + c : c; c = n / 58 | 0; d[j] = n % 58; j++ }
        }
        while (j--) s += CryptoHelper.MAP[d[j]];
        return s
    };

    async instantiateHelpers() {
        this.secp256k1 = await instantiateSecp256k1();
        this.sha256 = await instantiateSha256();
        this.ripemd160 = await instantiateRipemd160();
    }

    wallet(privateKey) {

        // Elliptic Public Key = ECDSA(privateKey)
        // Public Key = '0x04' + Elliptic Public Key
        // Encrypted Public Key = RIPEMD-160(SHA-256(Public Key))
        // Mainnet Encrypted Public Key = '0x00' + Encrypted Public Key
        //      Testnet Encrypted Public Key = '0x6f' + Encrypted Public Key
        // C = SHA-256(SHA-256(Mainnet Encrypted Public Key))
        // Checksum = First 4 bytes of C
        // Hex Address = Mainnet Encrypted Public Key + Checksum
        // Address = Base58(Hex Address)

        let privBytes = hexToBin(privateKey);

        // Standard
        let publicKeyUncompressed = this.secp256k1.derivePublicKeyUncompressed(privBytes);
        let addressUncompressed = this.getAddress(publicKeyUncompressed);

        let publicKeyCompressed = this.secp256k1.derivePublicKeyCompressed(privBytes);
        let addressCompressed = this.getAddress(publicKeyCompressed);


        return {
            publicKeyUncompressed: binToHex(publicKeyUncompressed),
            publicKeyCompressed: binToHex(publicKeyCompressed),
            addressUncompressed: addressUncompressed,
            addressCompressed: addressCompressed,
            address: addressCompressed,
        }
    }

    getAddress(publicKey) {
        let encPublicKey = this.ripemd160.hash(this.sha256.hash(publicKey));

        let mainnetEncPublicKey = new Uint8Array(encPublicKey.length + 1);
        mainnetEncPublicKey.set(new Uint8Array(CryptoHelper.MAINNET_PUBLIC));
        mainnetEncPublicKey.set(encPublicKey, 1);

        let c = this.sha256.hash(this.sha256.hash(mainnetEncPublicKey));
        let hashedAddress = new Uint8Array(mainnetEncPublicKey.length + 4);
        hashedAddress.set(mainnetEncPublicKey);
        hashedAddress.set(c.slice(0, 4), mainnetEncPublicKey.length);

        return CryptoHelper.toBase58(hashedAddress);
    }

}
