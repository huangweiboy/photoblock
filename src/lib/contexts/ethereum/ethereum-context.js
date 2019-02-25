import { ethers } from 'ethers';

export default class EthereumContext {

    static generateAccounts(hdInfo, count) {

        let wallet = ethers.Wallet.fromMnemonic(ethers.utils.HDNode.entropyToMnemonic(hdInfo.hash),`${hdInfo.path}/${hdInfo.index}`);
        let accountInfo = { address: wallet.address, publicKey: wallet.signingKey.publicKey };
        hdInfo = null;
        wallet = null;

        return accountInfo;
    }

    static updateDashboard(account, callback) {

        let provider = ethers.getDefaultProvider();
        provider.getBalance(account.address).then((balance) => {

            // format wei as ether
            let accountBalance = Number(ethers.utils.formatEther(balance)).toFixed(4);
        
            callback(`
                <div style="color:#ffffff;">
                    <div>Account Balance (ETH):</div>
                    <div style="font-weight:100;font-size:60px;line-height:60px;margin:20px 0;text-align:center;">${accountBalance}</div>
                    <div style="margin-top:40px;">Account Address: <a href="https://etherscan.io/address/${account.address}" target="_blank" title="${account.address}">${account.address.substring(0, 6)}...${account.address.substring(account.address.length-4)}</a></div>
                </div>
            `);
        });
        
    }
}