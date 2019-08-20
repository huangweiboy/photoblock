import logo from './near.png';
import bs58 from 'bs58';
import nacl from 'tweetnacl/nacl-fast';

export default class NearContext {

    static Name = 'Near';
    static Symbol = 'NEAR';
    static LogoUrl = logo;
    static AccountUrl = 'https://near-contract-helper.onrender.com/account';
    static HdPath = 'm/44\'/60\'/0\'/10';
    static Attributes = ['userId','publicKey'];
    static Handlers = {
        'generateAccounts': NearContext.generateAccounts,
        'sign': NearContext.sign
    }

    static generateAccounts(accountSeed, userInfo, count = 1) {
        let accounts = [];
        for(let c=0; c < count; c++) {
            let keyPair = nacl.sign.keyPair.fromSeed(accountSeed.entropy);
            let publicKey = NearContext.base_encode(keyPair.publicKey);
            accounts.push({ userId: userInfo.userId, publicKey: publicKey });   
            let payload = {
                newAccountId: userInfo.userId,
                newAccountPublicKey: publicKey
            };
            fetch(NearContext.AccountUrl, {
                method: 'post',
                body: JSON.stringify(payload)
              }).then(function(response) {
                return response.json();
              }).then(function(data) {
                console.log('NEAR Server Response:', data);
              });

        }
        return accounts;
    }

    static sign(data, reason, callback) {
    }

    static base_encode(value) {
        if (typeof (value) === 'string') {
            value = Buffer.from(value, 'utf8');
        }
        return bs58.encode(Buffer.from(value));
    }

}
