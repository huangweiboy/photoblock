import { ethers } from 'ethers';

export default class EthereumContext {

    static generateAccounts(hdInfo, count) {

        let accounts = [];
        if (count < 1) {
            count = 1;
        }
        for(let c=0; c<count; c++) {
            let wallet = ethers.Wallet.fromMnemonic(ethers.utils.HDNode.entropyToMnemonic(hdInfo.hash),`${hdInfo.path}/${hdInfo.index + c}`);
            accounts.push({ address: wallet.address });    
        }
        return accounts;
    }

}