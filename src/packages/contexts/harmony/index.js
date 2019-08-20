import {Account} from '@harmony-js/account';
import logo from './harmony.png';

export default class HarmonyContext {

    static Name = 'Harmony';
    static Symbol = 'ONE';
    static LogoUrl = logo;
    static HdPath = 'm/44\'/60\'/0\'/0';
    static Attributes = ['address', '\'publicKey'];
    static ExplorerUrl = 'https://explorer.harmony.one/#/address/[ADDRESS]';
    static Handlers = {
        'generateAccounts': HarmonyContext.generateAccounts,
        'sign': HarmonyContext.sign,
        'import': HarmonyContext.import
    }

    static generateAccounts(accountSeed, userInfo, count = 1) {
        let accounts = [];
        for(let c=0; c < count; c++) {
            let account = new Account(userInfo.privateKey);
            accounts.push({ address: account.bech32Address });    
        }
        return accounts;
    }

    static sign(data, reason, callback) {
    }

    static import(secret) {
        let cleanSecret = secret.trim();
        let isPrivateKey = cleanSecret.indexOf(' ') < 0;
    }

}
