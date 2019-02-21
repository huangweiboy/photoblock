import { ethers } from "ethers";

export default class EthereumContext {

    static getAccount(entropy, index) {
        console.log('Ethereum', index, entropy);
        return { address: '0x88888', publicKey: '12345678901234567890' };
    }
}