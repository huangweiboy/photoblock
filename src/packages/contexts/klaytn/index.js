import { ethers } from 'ethers';
import logo from './klaytn.png';

export default class KlaytnContext {

    static Name = 'Klaytn';
    static Symbol = 'KLAY';
    static LogoUrl = logo;
    static HdPath = 'm/44\'/60\'/0\'/10';
    static ExplorerUrl = 'https://baobab.scope.klaytn.com/account/[ADDRESS]';
    static Attributes = ['address', '\'publicKey'];
    static Handlers = {
        'generateAccounts': KlaytnContext.generateAccounts,
        'sign': KlaytnContext.sign
    }

    static generateAccounts(accountSeed, userInfo, count = 1) {
        let accounts = [];
        //let caver = new Caver('https://api.baobab.klaytn.net:8651/');
        for(let c=0; c < count; c++) {
            let wallet = ethers.Wallet.fromMnemonic(ethers.utils.HDNode.entropyToMnemonic(accountSeed.entropy),`${KlaytnContext.HdPath}/${accountSeed.index + c}`);
            accounts.push({ address: wallet.address });    
        }
        return accounts;
    }

    static sign(data, reason, callback) {
    }

}
