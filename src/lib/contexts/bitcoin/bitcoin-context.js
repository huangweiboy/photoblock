import { ethers } from 'ethers';
import '../../vendor/bitcoin/cryptojs';
import '../../vendor/bitcoin/cryptojs.ripemd160';
import '../../vendor/bitcoin/cryptojs.sha256';
import '../../vendor/bitcoin/securerandom';
import '../../vendor/bitcoin/biginteger';
import '../../vendor/bitcoin/ellipticcurve';
import '../../vendor/bitcoin/bitcoin.currency';
import '../../vendor/bitcoin/bitcoinjs-lib.base58';
import '../../vendor/bitcoin/bitcoinjs-lib.ecdsa';
import '../../vendor/bitcoin/bitcoinjs-lib.eckey';
import '../../vendor/bitcoin/bitcoinjs-lib.address';
import '../../vendor/bitcoin/bitcoinjs-lib.util';

export default class BitcoinContext {

    static generateAccounts(hdInfo, count) {

        let hdNode = ethers.utils.HDNode.fromMnemonic(ethers.utils.HDNode.entropyToMnemonic(hdInfo.hash));
        let derive = hdNode.derivePath(`${hdInfo.path}/${hdInfo.index}`);

        try {
            let address = BitcoinContext.getAccountDetails(derive.privateKey.substring(2));
            return { address: address }
        }
        catch(e) {
            console.log(e);
        }
        return null;
    }

    static getAccountDetails(privateKey) {
    
        var btcKey = new Bitcoin.ECKey(privateKey);
		if (btcKey.priv != null) {
            btcKey.setCompressed(false);
			let bitcoinAddress = btcKey.getBitcoinAddress();
			let wif = btcKey.getBitcoinWalletImportFormat();
            let keyInfo = {
                privateKeyHex: btcKey.toString().toUpperCase(),
                privateKeyBase64: btcKey.toString("base64"),
                publicKeyHex: btcKey.getPubKeyHex(),
                address: bitcoinAddress,
                privateKeyWif: wif,
            }
			btcKey.setCompressed(true);
			let bitcoinAddressComp = btcKey.getBitcoinAddress();
			let wifComp = btcKey.getBitcoinWalletImportFormat();

            Object.assign(keyInfo, {
                publicKeyCompressed: btcKey.getPubKeyHex(),
                addressCompressed: bitcoinAddressComp,
                privateKeyWifCompressed: wifComp
            });
            return keyInfo.addressCompressed;

			// ninja.qrCode.showQrCode({
			// 	"detailqrcodepublic": bitcoinAddress,
			// 	"detailqrcodepubliccomp": bitcoinAddressComp,
			// 	"detailqrcodeprivate": wif,
			// 	"detailqrcodeprivatecomp": wifComp
			// }, 4);
        }
        return null;
    }
    
}