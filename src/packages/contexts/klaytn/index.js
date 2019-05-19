//import Caver from 'caver-js';
import { ethers } from 'ethers';
import logo from './klaytn.png';

export default class KlaytnContext {

    static Name = 'Klaytn';
    static Symbol = 'KLAY';
    static LogoUrl = logo;
    static Count = 1;
    static HdPath = 'm/44\'/60\'/0\'/10';
    static Attributes = ['address', '\'publicKey'];
    static Handlers = {
        'generateAccounts': KlaytnContext.generateAccounts,
        'sign': KlaytnContext.sign
    }

    static generateAccounts(accountSeed) {
        let accounts = [];
        //let caver = new Caver('https://api.baobab.klaytn.net:8651/');
        for(let c=0; c < accountSeed.count; c++) {
            let wallet = ethers.Wallet.fromMnemonic(ethers.utils.HDNode.entropyToMnemonic(accountSeed.entropy),`${accountSeed.path}/${accountSeed.index + c}`);
            accounts.push({ address: wallet.address });    
        }
        return accounts;
    }

    static sign(data, reason, callback) {
    }

}
