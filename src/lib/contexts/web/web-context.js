export default class WebContext {

    static getAccount(entropy, index) {
        console.log('Web', index, entropy);
        return { userId: '0x88888', publicKey: '12345678901234567890' };
    }
}