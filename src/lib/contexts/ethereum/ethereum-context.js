import { ethers } from 'ethers';

export default class EthereumContext {

    static generateAccounts(hdInfo, count) {

        let wallet = ethers.Wallet.fromMnemonic(ethers.utils.HDNode.entropyToMnemonic(hdInfo.hash),`${hdInfo.path}/${hdInfo.index}`);
        let accountInfo = { address: wallet.address };
        hdInfo = null;
        wallet = null;

        return accountInfo;
    }

}