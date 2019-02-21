export default class BitcoinContext {

    static getAccount(entropy, index) {
        console.log('Bitcoin', index, entropy);
        return { address: '0x111111', publicKey: '12345678901234567890' };
    }
}