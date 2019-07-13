import {
    ethers
} from 'ethers';
import CryptoHelper from './crypto-helper';
import logo from './bitcoin.png';

export default class BitcoinContext {

    static cryptoHelper = null;
    static Name = 'Bitcoin';
    static Symbol = 'BTC';
    static LogoUrl = logo;
    static Count = 3;
    static HdPath = 'm/44\'/0\'/0\'/0';
    static Attributes = ['address', '\'publicKey'];
    static Handlers = {
        'generateAccounts': BitcoinContext.generateAccounts,
        'sign': BitcoinContext.sign,
        'init': BitcoinContext.init
    }

    static init() {
        if (BitcoinContext.cryptoHelper === null) {
            BitcoinContext.cryptoHelper = new CryptoHelper();
            BitcoinContext.cryptoHelper.instantiateHelpers();
        }
    }

    static generateAccounts(accountSeed) {
        try {
            let accounts = [];
            let hdNode = ethers.utils.HDNode.fromMnemonic(ethers.utils.HDNode.entropyToMnemonic(accountSeed.entropy));

            for (let c = 0; c < accountSeed.count; c++) {
                let derive = hdNode.derivePath(`${accountSeed.path}/${accountSeed.index + c}`);
                let wallet = BitcoinContext.cryptoHelper.wallet(derive.privateKey.substring(2));
               
                accounts.push({
                    address: wallet.address
                });
            }
            return accounts;

        } catch (e) {
            console.log(e);
        }
        return null;
    }

    static sign(data, reason, callback) {
    }
}