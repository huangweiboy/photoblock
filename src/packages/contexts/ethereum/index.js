import { ethers } from 'ethers';
import logo from './ethereum.png';

export default class EthereumContext {

    static Name = 'Ethereum';
    static Symbol = 'ETH';
    static LogoUrl = logo;
    static HdPath = 'm/44\'/60\'/0\'/0';
    static Attributes = ['address', '\'publicKey'];
    static ExplorerUrl = 'https://etherscan.io/address/[ADDRESS]';
    static Handlers = {
        'generateAccounts': EthereumContext.generateAccounts,
        'sign': EthereumContext.sign,
        'import': EthereumContext.import
    }

    static generateAccounts(accountSeed, userInfo, count = 1) {
        try {
            let accounts = [];
            for(let c=0; c < count; c++) {
                let wallet = ethers.Wallet.fromMnemonic(ethers.utils.HDNode.entropyToMnemonic(accountSeed.entropy),`${EthereumContext.HdPath}/${accountSeed.index + c}`);
                accounts.push({ address: wallet.address });    
            }
            console.log('Ethereum Accounts', accounts);
            return accounts;    
        }
        catch(e) {
            console.log(e);
        }

    }

    static sign(data, reason, callback) {
    }

    static import(secret) {
        let cleanSecret = secret.trim();
        let isPrivateKey = cleanSecret.indexOf(' ') < 0;

    }

}
