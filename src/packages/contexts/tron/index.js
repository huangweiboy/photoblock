import { ethers } from 'ethers';
import logo from './tron.png';

export default class TronContext {

    static Name = 'Tron';
    static Symbol = 'TRX';
    static LogoUrl = logo;
    static Count = 1;
    static HdPath = 'm/44\'/60\'/0\'/0';
    static Attributes = ['address', '\'publicKey'];
    static Handlers = {
        'generateAccounts': TronContext.generateAccounts,
        'sign': TronContext.sign
    }

    static generateAccounts(accountSeed) {
        let accounts = [];
        for(let c=0; c < accountSeed.count; c++) {
            let wallet = ethers.Wallet.fromMnemonic(ethers.utils.HDNode.entropyToMnemonic(accountSeed.entropy),`${accountSeed.path}/${accountSeed.index + c}`);
            accounts.push({ address: wallet.address });    
        }
        return accounts;
    }

    static sign(data, reason, callback) {
    }

}
