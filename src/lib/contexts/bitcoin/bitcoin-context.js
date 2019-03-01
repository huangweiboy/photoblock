import { ethers } from 'ethers';

export default class BitcoinContext {

    static generateAccounts(hdInfo, count) {

        try {
            let accounts = [];
            if (count < 1) {
                count = 1;
            }

            let hdNode = ethers.utils.HDNode.fromMnemonic(ethers.utils.HDNode.entropyToMnemonic(hdInfo.hash));
            let cryptoHelper = hdInfo.cryptoHelper;

            for(let c=0; c<count; c++) {
                let derive = hdNode.derivePath(`${hdInfo.path}/${hdInfo.index + c}`);
                accounts.push(cryptoHelper.wallet(derive.privateKey.substring(2)));    
            }
            return accounts;
                
        } catch (e) {
            console.log(e);
        }
        return null;
    }
}