import { ethers } from 'ethers';

export default class EthereumContext {

    static generateAccount(hdInfo) {

        let wallet = ethers.Wallet.fromMnemonic(ethers.utils.HDNode.entropyToMnemonic(hdInfo.hash),`${hdInfo.path}/${hdInfo.index}`);
        let accountInfo = { address: wallet.address, publicKey: wallet.signingKey.publicKey };
        hdInfo = null;
        wallet = null;

        return accountInfo;
    }
}