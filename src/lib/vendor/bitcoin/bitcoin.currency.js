
window.Bitcoin = {};

Bitcoin.currency = {
    createCurrency: function (name, networkVersion, privateKeyPrefix, WIF_Start, CWIF_Start, donate) {
        var currency = {};
        currency.name = name;
        currency.networkVersion = networkVersion;
        currency.privateKeyPrefix = privateKeyPrefix;
        currency.WIF_Start = WIF_Start;
        currency.CWIF_Start = CWIF_Start;
        currency.donate = donate;
        return currency;
    },

    name: function() {
        return Bitcoin.currency.selectedCurrency.name;
    },

    networkVersion: function() {
        return Bitcoin.currency.selectedCurrency.networkVersion;
    },

    privateKeyPrefix: function() {
        return Bitcoin.currency.selectedCurrency.privateKeyPrefix;
    },

    WIF_RegEx: function() {
        return new RegExp("^" + Bitcoin.currency.selectedCurrency.WIF_Start + "[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$");
    },

    CWIF_RegEx: function() {
        return new RegExp("^" + Bitcoin.currency.selectedCurrency.CWIF_Start + "[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$");
    },

    // Switch currency
    useCurrency: function(index) {
        Bitcoin.currency.selectedCurrency = Bitcoin.currency.currencies[index];

        // var coinImgUrl = "logos/" + Bitcoin.currency.name().toLowerCase() + ".png";
        // document.getElementById("coinLogoImg").src = coinImgUrl;

        // // Update title depending on currency
        // document.title = Bitcoin.currency.name() + " " + ninja.translator.get("title");
        // document.getElementById("siteTitle").alt = Bitcoin.currency.name() + " " + ninja.translator.get("title");

        // // Update i18n link
        // document.getElementById("cultureen").href = "?culture=en&currency=" + Bitcoin.currency.name().toLowerCase();
        // document.getElementById("culturefr").href = "?culture=fr&currency=" + Bitcoin.currency.name().toLowerCase();
        // document.getElementById("culturede").href = "?culture=de&currency=" + Bitcoin.currency.name().toLowerCase();
        // document.getElementById("culturenl").href = "?culture=nl&currency=" + Bitcoin.currency.name().toLowerCase();
        // document.getElementById("culturept").href = "?culture=pt&currency=" + Bitcoin.currency.name().toLowerCase();
        // document.getElementById("cultureru").href = "?culture=ru&currency=" + Bitcoin.currency.name().toLowerCase();
        // document.getElementById("culturees").href = "?culture=es&currency=" + Bitcoin.currency.name().toLowerCase();
        // document.getElementById("cultureua").href = "?culture=ua&currency=" + Bitcoin.currency.name().toLowerCase();
        // document.getElementById("culturetr").href = "?culture=tr&currency=" + Bitcoin.currency.name().toLowerCase();
        // document.getElementById("cultureit").href = "?culture=it&currency=" + Bitcoin.currency.name().toLowerCase();
        // document.getElementById("culturepl").href = "?culture=pl&currency=" + Bitcoin.currency.name().toLowerCase();
        // document.getElementById("culturezh").href = "?culture=zh&currency=" + Bitcoin.currency.name().toLowerCase();

        // if(ninja.seeder.isDone())
        // {
        //     // Regenerate a new wallet when not expensive
        //     ninja.wallets.singlewallet.generateNewAddressAndKey();
        //     ninja.wallets.paperwallet.build(document.getElementById('paperpassphrase').value);
        //     ninja.wallets.brainwallet.view();
        // }

        // // Reset wallet tab when expensive or not applicable
        // document.getElementById("bulktextarea").value = "";
        // document.getElementById("suppliedPrivateKey").value = "";

        // // easter egg doge ;)
        // if(Bitcoin.currency.name() == "Dogecoin")
        // {
        //     Bitcoin.currency.doge = new Doge(['wow', 'so paper wallet', 'such random', 'very pretty', 'much design', 'awesome', 'much crypto', 'such coin', 'wow!!', 'to da moon']);
        //     return;
        // }

        // if(Bitcoin.currency.doge != null)
        // {
        //     Bitcoin.currency.doge.stop();
        //     Bitcoin.currency.doge = null;
        // }
    },
};

Bitcoin.currency.currencies = [
    //                              name, networkVersion, privateKeyPrefix, WIF_Start, CWIF_Start, donate
    Bitcoin.currency.createCurrency ("2GIVE",               0x27, 0xa7, "6",    "R"    , "Givewmf4yv8uuHZG6Eb7sm17fJS2Trf6U8"),
    Bitcoin.currency.createCurrency ("42coin",              0x08, 0x88, "5",    "M"    , "4Fs42jYtLYrUMfKEXc6arojuhRsnYnerxN"),
    Bitcoin.currency.createCurrency ("Acoin",               0x17, 0xe6, "8",    "b"    , "AJvChtExuvLgAor9aw1Xz9bkvJY7JKD9uL"),
    Bitcoin.currency.createCurrency ("AGAcoin",             0x53, 0xd3, "8",    "Y"    , "aWg2jDBnecc17UHrDF5Rz5pj1rTqTDTnTH"),
    Bitcoin.currency.createCurrency ("Alphacoin",           0x52, 0xd2, "8",    "Y"    , "aAWhiGBDUugXC9ZBvw8CDNQH7KRurjy4Nq"),
    Bitcoin.currency.createCurrency ("Alqo",                0x17, 0xc1, "7",    "V"    , "ALF9ykkthT5UwmqdrThMRGb1GNgdCUciHL"),
    Bitcoin.currency.createCurrency ("Animecoin",           0x17, 0x97, "6",    "P"    , "AdA5nLS5FtPws6A3BX8aXccbP7fReptdw7"),
    Bitcoin.currency.createCurrency ("Anoncoin",            0x17, 0x97, "6",    "P"    , "AS3BvkE4wvsXJpn1bGhQni5vZajthnrWQE"),
    Bitcoin.currency.createCurrency ("Apexcoin",            0x17, 0x97, "6",    "P"    , "AdPxUCGLDUhHUTGYftffwFVdxbFy2nkXGX"),
    Bitcoin.currency.createCurrency ("Auroracoin",          0x17, 0x97, "6",    "T"    , "AVWH1ZutLd4Y5LPDDj5FkBjbm2Gci4iFx3"),
    Bitcoin.currency.createCurrency ("Aquariuscoin",        0x17, 0x97, "6",    "P"    , "ARk4VoaCHDoPDn2dctGizJaHFvXNRiDUDr"),
    Bitcoin.currency.createCurrency ("Axe",                 0x4B, 0xCB, "7",    "X"    , ""),
    Bitcoin.currency.createCurrency ("BBQcoin",             0x55, 0xd5, "6",    "T"    , "bTFFC3Gg2XzQygLxxakHkNM3ravBZby1y9"),
    Bitcoin.currency.createCurrency ("Biblepay",            0x19, 0xb6, "7",    "[TU]" , "BDvP86n4oVsLnFh1tCRXWLgBPK6ZtKrJQa"),
    Bitcoin.currency.createCurrency ("Bitcoin",             0x00, 0x80, "5",    "[LK]" , "15DHZzv7eBUwss77qczZiL3DUEZLjDYhbM"),
    Bitcoin.currency.createCurrency ("BitcoinCash",         0x00, 0x80, "5",    "[LK]" , "15DHZzv7eBUwss77qczZiL3DUEZLjDYhbM"),
    Bitcoin.currency.createCurrency ("BitcoinDark",         0x3c, 0xbc, "7",    "U"    , "RWtY5fg9ZQ9tYaPd7WJLgsdae1m1ZfrVRe"),
    Bitcoin.currency.createCurrency ("Bitcore",             0x00, 0x80, "5",    "[LK]" , "1H7fhCsyRfPP8XnJWhezXmi9YNqtBh9xxW"),
    Bitcoin.currency.createCurrency ("BitcoinGold",         0x26, 0x80, "5",    "[LK]" , "GYjahzU24Am88oZco6oFtpNzgwJTp9S4eB"),
    Bitcoin.currency.createCurrency ("Bitconnect",          0x12, 0x92, "5",    "N"    , "8Zixqosp1KFejfcVQzTWa2EsPa2VxSgeJX"),
    Bitcoin.currency.createCurrency ("Birdcoin",            0x2f, 0xaf, "6",    "[ST]" , "L97vGT4wRnyyiugHpLXzZzjqueN8YWRdRJ"),
    Bitcoin.currency.createCurrency ("BitSynq",             0x3f, 0xbf, "7",    "V"    , "SRtKRZxSjjwb9BXujkmvLfRHiutk7s7VXh"),
    Bitcoin.currency.createCurrency ("BitZeny",             0x51, 0x80, "5",    "[LK]" , "ZxUsfFszPsKdot4XnoZHZcMKg2PPS3NUji"),
    Bitcoin.currency.createCurrency ("Blackcoin",           0x19, 0x99, "6",    "P"    , "BFeJrZGyJ6bntd7RLXoNGvdn1HB5AQeiz4"),
    Bitcoin.currency.createCurrency ("BlackJack",           0x15, 0x95, "[56]", "P"    , "9pzHRZkJ4Df3EBiqXhDVgtB2A7FaAq6nnG"),
    Bitcoin.currency.createCurrency ("BlockNet",            0x1a, 0x9a, "6",    "P"    , "BhGtBAnfp7EUvbVr7R7uTJyHXF7Kt17wni"),
    Bitcoin.currency.createCurrency ("BolivarCoin",         0x55, 0xd5, "8",    "Y"    , "1J1HqJd2CRyacjEkMXxGzWVUYq6XfRqJEP"),
    Bitcoin.currency.createCurrency ("BoxyCoin",            0x4b, 0xcb, "7",    "X"    , "9pzHRZkJ4Df3EBiqXhDVgtB2A7FaAq6nnG"),
    Bitcoin.currency.createCurrency ("BunnyCoin",           0x1a, 0x9a, "6",    "P"    , "BosRXiiSB6WmiSbvzVAdUjpezCWhqpJGyW"),
    Bitcoin.currency.createCurrency ("Cagecoin",            0x1f, 0x9f, "6",    "Q"    , "DjUXeu9pUYq5RsN7qpowb1C8LcvPNi9Bx3"),
    Bitcoin.currency.createCurrency ("CampusCoin",          0x1c, 0x9c, "6",    "Q"    , "Cawn4BSvSuPFHk3wo43Nm85CG8TW1Y2s1H"),
    Bitcoin.currency.createCurrency ("CanadaeCoin",         0x1c, 0x9c, "6",    "Q"    , "CbaoyW9KYP8qQHb9Lu59crvjemryCD88Hv"),
    Bitcoin.currency.createCurrency ("CannabisCoin",        0x1c, 0x9c, "6",    "Q"    , "Cb7SSkHpnk1PwKqKbreMALzJpnmAsBNvnG"),
    Bitcoin.currency.createCurrency ("Capricoin",           0x1c, 0x9c, "6",    "Q"    , "CS1mBL1dyCR8jH5hRrQiZ4Xz37UWwcbUAJ"),
    Bitcoin.currency.createCurrency ("CassubianDetk",       0x1e, 0x9e, "6",    "Q"    , "DBPagysmjfdkND4Zp1SM4myLenNfXpFWnG"),
    Bitcoin.currency.createCurrency ("CashCoin",            0x22, 0xa2, "6",    "[QR]" , "F3bkQC7xGZZcPFmsucYas7KuHoEwCPtGHC"),
    Bitcoin.currency.createCurrency ("Catcoin",             0x15, 0x95, "[56]", "P"    , "9rEXDemG6S3k2ddAsKFzRpnMVz3bVryYXZ"),
    Bitcoin.currency.createCurrency ("ChainCoin",           0x1c, 0x9c, "6",    "Q"    , "Ca62ZnR3sfKotqDJzsBW6k75rTFFgFkw1x"),
    Bitcoin.currency.createCurrency ("ColossusCoinXT",      0x1e, 0xd4, "5",    "[LK]" , "D9buTahK9CXNxoGzXLZ9tamwrQzdW2MzvG"),
    Bitcoin.currency.createCurrency ("Condensate",          0x3c, 0xbc, "7",    "U"    , "RRZZMHaYZXCeUWRVeRvttKCNcvTRCxBfqD"),
    Bitcoin.currency.createCurrency ("Copico",              0x1c, 0x90, "5",    "N"    , "CKWBhVUwQP4fRw6xJk4nxCqKYCMz74bPKr"),
    Bitcoin.currency.createCurrency ("CopperCoin",          0x1c, 0x9c, "6",    "Q"    , "CXh8p64WqmEwTkQSDk9azaZUqrnXE9WESV"),
    Bitcoin.currency.createCurrency ("Corgicoin",           0x1c, 0x9c, "6",    "Q"    , "CNwV11TaKrfB3TnBS8vQjNbWT6CNxV8GBi"),
    Bitcoin.currency.createCurrency ("CryptoBullion",       0x0b, 0x8b, "5",    "M"    , "Cd9CgzTChm9yJQZ3SL3PUSsMkEEN8LGwCF"),
    Bitcoin.currency.createCurrency ("CryptoClub",          0x23, 0xa3, "6",    "R"    , "FKPFTw5LjoeGTZP1d3zHLfZNm91FktgPWY"),
    Bitcoin.currency.createCurrency ("Cryptoescudo",        0x1c, 0x9c, "6",    "Q"    , "Cd9CgzTChm9yJQZ3SL3PUSsMkEEN8LGwCF"),
    Bitcoin.currency.createCurrency ("Cryptonite",          0x1c, 0x80, "5",    "[LK]" , "CP6uhgcDnXzdgQhnz2q1xhSFMFinmqkQkh"),
    Bitcoin.currency.createCurrency ("CryptoWisdomCoin",    0x49, 0x87, "5",    "[LM]" , "WYeSz9KmpjgdtycPiJVPcQdp7bBqECfr3W"),
    Bitcoin.currency.createCurrency ("C2coin",              0x1c, 0x9c, "6",    "Q"    , "Cd3kyj77p2zivnqbcoBzNya7LD1w7uUU9v"),
    Bitcoin.currency.createCurrency ("Dash",                0x4c, 0xcc, "7",    "X"    , "XdYX6AbDzjb3AVL1tAmWjuYMD28LD9fcWS"),
    Bitcoin.currency.createCurrency ("DeafDollars",         0x30, 0xb0, "6",    "T"    , "LNHYnoqySwoN5aMyEVavEBT3CxHA9WrTZs"),
    Bitcoin.currency.createCurrency ("DeepOnion",           0x1f, 0x9f, "6",    "Q"    , "DhUAMCqydnYNx9PmeQ1wnyeyAxi477DbTz"),
    Bitcoin.currency.createCurrency ("Deutsche eMark",      0x35, 0xb5, "7",    "T"    , "Ni4112Tmv1ScZ9fkN76knJ4jRTxeHQieJM"),
    Bitcoin.currency.createCurrency ("Devcoin",             0x00, 0x80, "5",    "[LK]" , "1GUeBfpVhN7xySQej3HiSe5c8jQoVQPosv"),
    Bitcoin.currency.createCurrency ("DigiByte",            0x1e, 0x9e, "6",    "Q"    , "D9s71nQPBCEbM2SvGwHQcrhay6KrJaVo3Z"),
    Bitcoin.currency.createCurrency ("Digitalcoin",         0x1e, 0x9e, "6",    "Q"    , "D7fJwPfW4dFSJNq4NHbMiYJhYnrZehMpqx"),
    Bitcoin.currency.createCurrency ("Dimecoin",            0x0f, 0x8f, "5",    "N"    , "7CRKjq135uBC2FgatpAzoJFLPRGL9gCqVp"),
    Bitcoin.currency.createCurrency ("DNotes",              0x1f, 0x9f, "6",    "Q"    , "DqmNyJd9xiaNpE65meAYX6EqJCFDwhsQoX"),
    Bitcoin.currency.createCurrency ("Dogecoin",            0x1e, 0x9e, "6",    "Q"    , "D74Npoqhwhjw9fShkm5wbj6DD2BJXpmzPj"),
    Bitcoin.currency.createCurrency ("DogecoinDark",        0x1e, 0x9e, "6",    "Q"    , "DLbjdRYsfiT62JZf5YxSAfNZJo1VKxDTNP"),
    Bitcoin.currency.createCurrency ("eGulden",             0x30, 0xb0, "6",    "T"    , "LhBsKs2GUb24KBAzZfua5AsqfQF5uPdWXQ"),
    Bitcoin.currency.createCurrency ("eKrona",              0x2d, 0xad, "6",    "S"    , "KLi8FnMZmSH8EfXYgJwi4R2ZyMscJykXT5"),
    Bitcoin.currency.createCurrency ("ELECTRA",             0x21, 0xa1, "6",    "Q"    , "EeJGVF9efipxqJcwf7dup735ATEDc2f1Yk"),
    Bitcoin.currency.createCurrency ("Ember",               0x5c, 0x32, "2",    "8"    , "eGFUogU3DceaBgY5a6qBQC22WwYsboG2gw"),
    Bitcoin.currency.createCurrency ("Emerald",             0x22, 0xa2, "6",    "[QR]" , "EnJnzAQSpPp7RshMhNx9zhRnabxTLird6W"),
    Bitcoin.currency.createCurrency ("Emercoin",            0x21, 0x80, "5",    "[LK]" , "EN5nVyEbLrhYfcjoyGgQFtD3QHETyj1dy1"),
    Bitcoin.currency.createCurrency ("EnergyCoin",          0x5c, 0xdc, "8",    "Z"    , "eD2P3q5PdyHYNwT94Dg6Wt4pBz64k8gwGf"),
    Bitcoin.currency.createCurrency ("Espers",              0x21, 0x90, "5",    "N"    , "EVB5z1zoYYZrjUnGw3fekn1aMjfVhMUKHW"),
    Bitcoin.currency.createCurrency ("Fastcoin",            0x60, 0xe0, "8",    "a"    , "frxe8F7gQdiAVgy4mRXjpXH5vN1wyta1db"),
    Bitcoin.currency.createCurrency ("Feathercoin",         0x0e, 0x8e, "5",    "N"    , "6dxAP6oacHsove5X2kZPpddcT1Am167YzC"),
    Bitcoin.currency.createCurrency ("Fedoracoin",          0x21, 0x80, "5",    "[KL]" , "ENRPj6iEh14Xky2hv4B7zTJGMe5Kchjeo8"),
    Bitcoin.currency.createCurrency ("Fibre",               0x23, 0xa3, "6",    "R"    , "F6qGSM29vJm2q3Q9uvozpym7WYqKXBrpqm"),
    Bitcoin.currency.createCurrency ("Florincoin",          0x23, 0xb0, "6",    "T"    , "FLJ7vLPZDLMVr2KPEvZMgWvh8TCXj5Bn3m"),
    Bitcoin.currency.createCurrency ("Flurbo",              0x23, 0x30, "6",    "8"    , "FH65pxAbpGjLzjGGfGETSZhgLf2SXGuGBi"),
    Bitcoin.currency.createCurrency ("Fluttercoin",         0x23, 0xa3, "6",    "R"    , "FJioRLt3gLtqk3tUdMhwjAVo1sdWjRuwqt"),
    Bitcoin.currency.createCurrency ("FrazCoin",            0x23, 0xA3, "6",    "R"    , "F8uHqHrLrToXSMrVVTzap34LBhVSEEWUmm"),
    Bitcoin.currency.createCurrency ("Freicoin",            0x00, 0x80, "5",    "[LK]" , "18kVnAk5Undi7CqEgGx63YDKBPFpxYJmT9"),
    Bitcoin.currency.createCurrency ("FUDcoin",             0x23, 0xa3, "6",    "R"    , "FEKsbaLJHjbEnuMiRDvtnyvxaJqehBtQ5V"),
    Bitcoin.currency.createCurrency ("Fuelcoin",            0x24, 0x80, "5",    "[KL]" , "Fq1sL24MgDt7tTiKh8MPvhz2UMP8e1uCo4"),
    Bitcoin.currency.createCurrency ("Fujicoin",            0x24, 0xa4, "6",    "R"    , "Fqr2ZrqWPCryqsfjdghwMT3enGHukGonit"),
    Bitcoin.currency.createCurrency ("GabenCoin",           0x10, 0x90, "5",    "N"    , "7cwtF11nW4qAGp2pFdLuUZ5gzJWiXtUvi1"),
    Bitcoin.currency.createCurrency ("Garlicoin",           0x26, 0xb0, "6",    "T"    , "GdHMURSy1H9NbognUvKNmBXciMnqEpRnjg"),
    Bitcoin.currency.createCurrency ("GlobalBoost",         0x26, 0xa6, "6",    "R"    , "GeXdH1WhzA7ayYim9sdCCQKcVukUq1W8LJ"),
    Bitcoin.currency.createCurrency ("Goodcoin",            0x26, 0xa6, "6",    "R"    , "GM3kAbQGaMVAYk8U3CrVGhSwz1hZaF6gVM"),
    Bitcoin.currency.createCurrency ("GridcoinResearch",    0x3e, 0xbe, "7",    "V"    , "SHs9ESzUL9VAEcq7kStfF1JUAMaNT1EYzJ"),
    Bitcoin.currency.createCurrency ("Gulden",              0x26, 0xa6, "6",    "R"    , "GLD7BDBYyddx6Sr72zGfreRG21dJAe74j8"),
    Bitcoin.currency.createCurrency ("Guncoin",             0x27, 0xa7, "6",    "R"    , "GwVej6c3tF9GqEdSKmwJiUDWtQVK2wY9fP"),
    Bitcoin.currency.createCurrency ("HamRadioCoin",        0x00, 0x80, "5",    "LK"   , "1JQVWKT1NQJUJbbq4UdJUY8DbWmgqrrHWz"),
    Bitcoin.currency.createCurrency ("HFRcoin",             0x10, 0x90, "5",    "N"    , ""),
    Bitcoin.currency.createCurrency ("HOdlcoin",            0x28, 0xa8, "5",    "[LK]" , "H9SvPiwASJnsCcNS6QWJc3vi3FxoEHEKVb"),
    Bitcoin.currency.createCurrency ("HTMLCoin",            0x29, 0xa9, "6",    "S"    , "HskoM3SRgw3QLV1vHm98cCbFQedHfXZyM2"),
    Bitcoin.currency.createCurrency ("HyperStake",          0x75, 0xf5, "9",    "d"    , "p71G6VRVxTTxg3Hqa9CbENeJY1PumBjtvL"),
    Bitcoin.currency.createCurrency ("ImperiumCoin",        0x30, 0xb0, "6",    "T"    , "LKcNNWGDyKyedwL8QNsCkg2122fBQyiDat"),
    Bitcoin.currency.createCurrency ("IncaKoin",            0x35, 0xb5, "7",    "T"    , "NdEXATr2NSG1pkzC2kScnEnj6g3KYpLnT9"),
    Bitcoin.currency.createCurrency ("IncognitoCoin",       0x00, 0x80, "5",    "LK"   , "1BbRmhGKyKshFge9kBMdfJyQr3KZoh5K5t"),
    Bitcoin.currency.createCurrency ("Influxcoin",          0x66, 0xe6, "8",    "b"    , "i83eN9HxFvfsxSwjXiZQZaWf13cWF25K9Y"),
    Bitcoin.currency.createCurrency ("Innox",               0x4b, 0xcb, "7",    "X"    , "XQm6Vy2tTh87ZnWg6cBdZBmYVExbVuScBF"),
    Bitcoin.currency.createCurrency ("IridiumCoin",         0x30, 0xb0, "6",    "T"    , "LKTu2strS8zV1mDJxJtgE3HLqChD2m54yN"),
    Bitcoin.currency.createCurrency ("iCash",               0x66, 0xcc, "7",    "X"    , "iKCghTCFEPhriPxrduWxks2SCDE1XKzCU6"),
    Bitcoin.currency.createCurrency ("iXcoin",              0x8a, 0x80, "5",    "[LK]" , "xnF1nshqFLaVdDGBmQ4k2jBQkr8nbuCkLz"),
    Bitcoin.currency.createCurrency ("Judgecoin",           0x2b, 0xab, "6",    "S"    , "JbF9ZnvoFkBdasPEq21jCCTnTUDSiyWrAQ"),
    Bitcoin.currency.createCurrency ("Jumbucks",            0x2b, 0xab, "6",    "S"    , "JSzHiaoD6ewtymBMJHsHqkpFzCYKBzxJeC"),
    Bitcoin.currency.createCurrency ("KHcoin",              0x30, 0xb0, "6",    "T"    , "LZWM2nptWZpSDZna5k96Rk1uqN8NDTigvK"),
    Bitcoin.currency.createCurrency ("KittehCoin",          0x2d, 0xad, "6",    "S"    , "KQkaGcgZvbKXoNWaPh5upwUMvEVvvEY5tY"),
    Bitcoin.currency.createCurrency ("Lanacoin",            0x30, 0xb0, "6",    "T"    , "LhqrrTHtfNMn8rZi7QesFbbpJYeGWX7319"),
    Bitcoin.currency.createCurrency ("Latium",              0x17, 0x80, "5",    "[LK]" , "ASz2EgegeXfKyHaY1SbJ6nCDK6sxd7BpXg"),
    Bitcoin.currency.createCurrency ("LBRY Credits",        0x55, 0x80, "5",    "[LK]" , "bTLCuxhV5m6DK9yPmADz9H23PyoaQo84KP"),
    Bitcoin.currency.createCurrency ("Litecoin",            0x30, 0xb0, "6",    "T"    , "LiScnsyPcqsyxn1fx92BcFguryXcw4DgCy"),
    Bitcoin.currency.createCurrency ("LiteDoge",            0x5a, 0xab, "6",    "S"    , "daaV1gQ63HpHHn4Ny1fJZHMA7KCeUVE538"),
    Bitcoin.currency.createCurrency ("LoMoCoin",            0x30, 0xb0, "6",    "T"    , "LSdeGMxfMFX38GHCFQT65SJaU1E8ezT2og"),
    Bitcoin.currency.createCurrency ("MadbyteCoin",         0x32, 0x6e, "4",    "H"    , "MCBdZDK326yhGM77nWjj3vHX96edd2PQW3"),
    Bitcoin.currency.createCurrency ("MagicInternetMoney",  0x30, 0xb0, "6",    "T"    , "LPRqCTYEy53FkEzhRTCauLc7Qq23Z5mxZU"),
    Bitcoin.currency.createCurrency ("Magicoin",            0x14, 0x94, "5",    "[NP]" , "9H6ddyu9S9gyrEHxVrpMBTBZWrwAvdtehD"),
    Bitcoin.currency.createCurrency ("Marscoin",            0x32, 0xb2, "6",    "T"    , "M8caDttyKt2r7V7WHMMkRZ1jEzxj16fgCn"),
    Bitcoin.currency.createCurrency ("MarteXcoin",          0x32, 0xb2, "6",    "T"    , "M8DSVG13j3qpNDRbuuUBh5juQmSd15wLXH"),
    Bitcoin.currency.createCurrency ("MasterDoge",          0x33, 0x8b, "5",    "M"    , "Mm4Xqy9FYZ8N1NJzuXCaJLZcw8o2cmVC7c"),
    Bitcoin.currency.createCurrency ("Mazacoin",            0x32, 0xe0, "8",    "a"    , "MLUXCv3GfNgmUSXc5Ek3ePaQ4cfsJwEXHa"),
    Bitcoin.currency.createCurrency ("Megacoin",            0x32, 0xb2, "6",    "T"    , "MPeVmJHvkXN3caneWCB5zGgtGHRRBSLmWd"),
    Bitcoin.currency.createCurrency ("MintCoin",            0x33, 0xb3, "[67]", "T"    , "MdT7t7MhbgQLSdMhHJCyoGHUuniqZDrj4h"),
    Bitcoin.currency.createCurrency ("MobiusCoin",          0x00, 0x80, "5",    "[LK]" , "1HKNrUR3BaFC8u4VMfnjCuXDPrYGh7jU8S"),
    Bitcoin.currency.createCurrency ("MonetaryUnit",        0x10, 0x7e, "5",    "K"    , "7gzstwRu4owvwk7Se5pPVG8A5pgdgsDzUV"),
    Bitcoin.currency.createCurrency ("Monocle",             0x32, 0xb2, "6",    "T"    , "M9CFHZjyCipuKqByD5K1sCHmt7etuCFGsc"),
    Bitcoin.currency.createCurrency ("MoonCoin",            0x03, 0x83, "5",    "L"    , "2P2V9npcK7apbUFsWN3zL7R6ARBMwTJ4hA"),
    Bitcoin.currency.createCurrency ("Myriadcoin",          0x32, 0xb2, "6",    "T"    , "MWGDtjDw9c8C6zicDQF22yZBWbEX53v4o9"),
    Bitcoin.currency.createCurrency ("NameCoin",            0x34, 0x80, "5",    "[LK]" , "NASxLK4nt5hgX9wQEny5qPPJ2q4uSGCvT9"),
    Bitcoin.currency.createCurrency ("Navcoin",             0x35, 0x96, "6",    "P"    , "NP2wVKjiT1PbpkFMCfkSxR7QsV3iezf4T6"),
    Bitcoin.currency.createCurrency ("NeedleCoin",          0x35, 0xb5, "7",    "T"    , "NYtEDYHNabMqiad5J2tEPFwE9wnhJQpN1W"),
    Bitcoin.currency.createCurrency ("NEETCOIN",            0x35, 0xb5, "7",    "T"    , "NgTALUftFyFk8osvqo5TryBkeNYKvGBssp"),
    Bitcoin.currency.createCurrency ("NYC",                 0x3c, 0xbc, "7",    "U"    , "RY1XJPWksA5zUTCNJ416XJhY9yiFSFfTvz"),
    Bitcoin.currency.createCurrency ("Neoscoin",            0x35, 0xb1, "6",    "T"    , "NZw6WJPiKYcXxua1VveieihiNJRYanHjrP"),
    Bitcoin.currency.createCurrency ("Nevacoin",            0x35, 0xb1, "6",    "T"    , "NQDJrKGP3TNhKhKzaHMdg1Wk9FWCT4Nx3q"),
    Bitcoin.currency.createCurrency ("Novacoin",            0x08, 0x88, "5",    "M"    , "4EZMrEA5LnmwtcK5b2JfCq9k5YS4ZVZrtT"),
    Bitcoin.currency.createCurrency ("Nubits",              0x19, 0xbf, "7",    "V"    , "BPWCkyaVqWdaf3uqahrgdTjB2QTnRZzPMM"),
    Bitcoin.currency.createCurrency ("Nyancoin",            0x2d, 0xad, "6",    "S"    , "KHRsf8ofFYqGm4XoeHuFakKPLs5CH2dhK3"),
    Bitcoin.currency.createCurrency ("Ocupy",               0x73, 0xf3, "9",    "[cd]" , "ocLKVPkQRFtKn5mFygrd4QJG9eZd1sKTyi"),
    Bitcoin.currency.createCurrency ("Omnicoin",            0x73, 0xf3, "9",    "[cd]" , "oMesh62joeab2yMoJUH28mGE8h2suDzcYc"),
    Bitcoin.currency.createCurrency ("Onyxcoin",            0x73, 0xf3, "9",    "[cd]" , "odRRCGXooJvKs7cn7sax1bJv9EJwwEy94Z"),
    Bitcoin.currency.createCurrency ("PacCoin",             0x18, 0x98, "6",    "P"    , ""),
    Bitcoin.currency.createCurrency ("Particl",             0x38, 0x6c, "4",    "[HG]" , ""),
    Bitcoin.currency.createCurrency ("Paycoin",             0x37, 0xb7, "7",    "U"    , "PV2t9zzj9rQm81c9VJqqL8edj1ndpcW9HD"),
    Bitcoin.currency.createCurrency ("Pandacoin",           0x37, 0xb7, "7",    "U"    , "PT6guZjCgsrBkqCUhTnG1NNBYBqgzo8gVv"),
    Bitcoin.currency.createCurrency ("ParkByte",            0x37, 0xb7, "7",    "U"    , "PCLozfQ5cBinqdRFGEf6DkuC56YU1jWzMQ"),
    Bitcoin.currency.createCurrency ("Peercoin",            0x37, 0xb7, "7",    "U"    , "PSnwUwknbmqUU1GCcM1DNxcANqihpdt3tW"),
    Bitcoin.currency.createCurrency ("Pesetacoin",          0x2f, 0xaf, "6",    "[ST]" , "L6qoz2SQN6U9vGNoST35QP85PQbg4s5rDn"),
    Bitcoin.currency.createCurrency ("PHCoin",              0x37, 0xb7, "7",    "U"    , "P9e6c714JUHUfuBVHSS36eqaxGCN6X8nyU"),
    Bitcoin.currency.createCurrency ("PhoenixCoin",         0x38, 0xb8, "7",    "U"    , "PsaaD2mLfAPUJXhMYdC1DBavkJhZj14k6X"),
    Bitcoin.currency.createCurrency ("PiggyCoin",           0x76, 0xf6, "9",    "d"    , "pqXotCKo6mmtYtLY5mi9uEW22mPFgKoLvx"),
    Bitcoin.currency.createCurrency ("Pinkcoin",            0x3,  0x83, "[RQP]","L"    , "2Xgy8K2n5cVmnm8Se2rDojQ1GdfHdktx8r"),
    Bitcoin.currency.createCurrency ("PIVX",                0x1e, 0xd4, "8",    "Y"    , "DSiCurCzgdzqSP1urFg3VZJfrpyhMWjEAp"),
    Bitcoin.currency.createCurrency ("Peercoin",            0x37, 0xb7, "7",    "U"    , "PSnwUwknbmqUU1GCcM1DNxcANqihpdt3tW"),
    Bitcoin.currency.createCurrency ("Potcoin",             0x37, 0xb7, "7",    "U"    , "PQcMNuCdeooMcS5H3DGwxXnSE2kmyVMU39"),
    Bitcoin.currency.createCurrency ("Primecoin",           0x17, 0x97, "6",    "P"    , "AbXChfoHyFESePFuVh1xLZdn7Rj1mfD2a4"),
    Bitcoin.currency.createCurrency ("ProsperCoinClassic",  0x3a, 0xba, "7",    "Q"    , "QXLqozFHKP1fdvx4LKMYmtEHWciEZ9pD2F"),
    Bitcoin.currency.createCurrency ("Quark",               0x3a, 0xba, "7",    "U"    , "QNGJBwRApKKwEevTvDwpeoSgmo6w6wv8yQ"),
    Bitcoin.currency.createCurrency ("Qubitcoin",           0x26, 0xe0, "8",    "a"    , "GeNTNSwEh5ZCRCE6LtnMwHCk8VU2Lu8QE7"),
    Bitcoin.currency.createCurrency ("Reddcoin",            0x3d, 0xbd, "7",    "[UV]" , "RmAB99NsX6Wbjk5WdqNeEab83y72d7zkqZ"),
    Bitcoin.currency.createCurrency ("Riecoin",             0x3c, 0x80, "5",    "[LK]" , "RUsNQFds88sdWszMUVKwfdBhE9PtzLTK6N"),
    Bitcoin.currency.createCurrency ("Rimbit",              0x3c, 0xbc, "7",    "U"    , "RJNYNAafwKmkGf1hb3LDXiL1gRhSPPrXxN"),
    Bitcoin.currency.createCurrency ("ROIcoin",             0x3c, 0x80, "5",    "[LK]" , "RKUwWKMfwoq2trvQ4Q3a529U7KZq3Pq6gw"),
    Bitcoin.currency.createCurrency ("Rubycoin",            0x3c, 0xbc, "7",    "U"    , "RNsGHZnnr4pa3nYSp5NsuPtqTAGHT6XWqb"),
    Bitcoin.currency.createCurrency ("Rupaya",              0x3c, 0xbc, "7",    "U"    , "RENYagTnHvczPgFYaAhfVqh9y6B1yaMaij"),
    Bitcoin.currency.createCurrency ("Sambacoin",           0x3e, 0xbe, "7",    "V"    , "SJdiAgazqtum79HzGbNDxi879NzSDjtH5P"),
    Bitcoin.currency.createCurrency ("SecKCoin",            0x3f, 0xbf, "7",    "V"    , "Se1aaa5T1HRpMEfyBPGswVUgTQoZUst9jA"),
    Bitcoin.currency.createCurrency ("SibCoin",             0x3f, 0x80, "5",    "[LK]" , "SY7GAzvFVS8bUA89e7hosPMxqMS482ecsp"),
    Bitcoin.currency.createCurrency ("SixEleven",           0x34, 0x80, "5",    "[LK]" , "NGPimZxoZMmAsoF4eJME8TkG7UW8vqoJQJ"),
    Bitcoin.currency.createCurrency ("SmileyCoin",          0x19, 0x99, "6",    "P"    , "BEaZDZ8gCbbP1y3t2gPNKwqZa76rUDfR73"),
    Bitcoin.currency.createCurrency ("SongCoin",            0x3f, 0xbf, "7",    "V"    , "SSK9MXormZXgF5ZfV599okJRXYh3g9RXGN"),
    Bitcoin.currency.createCurrency ("SpreadCoin",          0x3f, 0xbf, "7",    "V"    , "SjPkh7V2KkySjL52wsD2CpEj4quTtjiaVW"),
    Bitcoin.currency.createCurrency ("StealthCoin",         0x3e, 0xbe, "7",    "V"    , "SJJGGq7UyoUH1TExGJCQ6ee49ztJr2quF8"),
    Bitcoin.currency.createCurrency ("Stratis",             0x3f, 0xbf, "7",    "V"    , "ScMNGH91SpNwbRDeK8vYXXJ3aYpwBr9Pen"),
    Bitcoin.currency.createCurrency ("SwagBucks",           0x3f, 0x99, "6",    "P"    , "SJJGGq7UyoUH1TExGJCQ6ee49ztJr2quF8"),
    Bitcoin.currency.createCurrency ("Syscoin",             0x00, 0x80, "5",    "[LK]" , "133miKEHohCR5qnbEZ64MFZkCzFM2HpeAd"),
    Bitcoin.currency.createCurrency ("Tajcoin",             0x41, 0x6f, "6",    "H"    , "TWYZCoBw6Kd5fKZ5wWpqgJaeNAbuRF9Qg8"),
    Bitcoin.currency.createCurrency ("Terracoin",           0x00, 0x80, "5",    "[LK]" , "1BQH6gBzkxxyMQG3VSJCHnmVGfWu64nbPL"),
    Bitcoin.currency.createCurrency ("Titcoin",             0x00, 0x80, "5",    "[LK]" , "1CHAo7muicsLHdPk5q4asrEbh6aUeSPpdC"),
    Bitcoin.currency.createCurrency ("TittieCoin",          0x41, 0xc1, "7",    "V"    , "TYrdtLy9irV4u1yo2YQVCkS27RzDzBqWwJ"),
    Bitcoin.currency.createCurrency ("Topcoin",             0x42, 0xc2, "7",    "V"    , "TmDTsQqqv1LWGw4xjGNiJ7ABwdCenf2BFF"),
    Bitcoin.currency.createCurrency ("TransferCoin",        0x42, 0x99, "6",    "P"    , "TbnW6ih8314ksuutJpRjwUbc2mAkz64Tij"),
    Bitcoin.currency.createCurrency ("TreasureHuntCoin",    0x32, 0xb2, "6",    "T"    , "MKnC2upgCNfVMS2phkV8SqGaXUGkn39EaX"),
    Bitcoin.currency.createCurrency ("TrezarCoin",          0x42, 0xC2, "7",    "V"    , "Tw1jsLJKfmcosUCkJuMevdLLJob9wD7PSE"),
    Bitcoin.currency.createCurrency ("Unobtanium",          0x82, 0xe0, "8",    "a"    , "uZ8Gq61NGJ2wz3PLybXyXKLYC1FhRpz8Kq"),
    Bitcoin.currency.createCurrency ("USDe",                0x26, 0xa6, "6",    "R"    , "GQTeNSfx6xPbBNsUfqoZNrrCBQXeY5Dtdu"),
    Bitcoin.currency.createCurrency ("Vcash",               0x47, 0xc7, "7",    "W"    , "VoaKH8ndxJoFfM3XJ7DK3P6g7kxASpCf5g"),
    Bitcoin.currency.createCurrency ("Versioncoin",         0x46, 0xc6, "7",    "W"    , "VRYmn3ABchWK7ZSx2V3VD6TzxmqCLsxJSH"),
    Bitcoin.currency.createCurrency ("VergeCoin",           0x1e, 0x9e, "6",    "Q"    , "DJvyiaUdFAH7zmn23SaWzSj9FT5X9a3pSS"),
    Bitcoin.currency.createCurrency ("Vertcoin",            0x47, 0x80, "5",    "[LK]" , "VkmBz8JJWLP1sVH9sGwc1Fz7o5RtXLW4J5"),
    Bitcoin.currency.createCurrency ("Viacoin",             0x47, 0xc7, "7",    "W"    , "VeJMvqvsZFoTkYfitzEG8fYy7bC7hxMfT1"),
    Bitcoin.currency.createCurrency ("VikingCoin",          0x46, 0x56, "3",    "D"    , "VJXz1cD1mDGQmu52aDdd7Q2G5ejqA6mcqw"),
    Bitcoin.currency.createCurrency ("W2Coin",              0x49, 0xc9, "7",    "W"    , "Wa3AvKUP5J3BpEa93nwKHPAAQ2P1XdTCeU"),
    Bitcoin.currency.createCurrency ("WACoins",             0x49, 0xc9, "7",    "W"    , ""),
    Bitcoin.currency.createCurrency ("WankCoin",            0x00, 0x80, "5",    "[LK]" , "1CnEFZZxJQkNAvgFGdRV5JEKShkNj1LRWL"),
    Bitcoin.currency.createCurrency ("WeAreSatoshiCoin",    0x87, 0x97, "6",    "P"    , "wSEgPsCGqQESLDyzBJkwCXvMP1z3e1Qi3X"),
    Bitcoin.currency.createCurrency ("WorldCoin",           0x49, 0xc9, "7",    "W"    , "WNmGkn2WQZKS6xKHEsj5AqSbuE4sh9Upyb"),
    Bitcoin.currency.createCurrency ("XP",                  0x4b, 0xcb, "7",    "X"    , "XLRykcGjFMpBDQ7PHfamR2DR4Z21qTUBHG"),
    Bitcoin.currency.createCurrency ("Yenten",              0x4e, 0x7b, "5",    "K"    , "YStuCpv1U9iT3L1VqBr52B9nBxrNgt4Fpj"),
    Bitcoin.currency.createCurrency ("Zcash",        [0x1c,0xb8], 0x80, "5",    "[LK]" , "t1XA64Hw47QaCxCUEgZbc4FVdH811RMd1xp"),
    Bitcoin.currency.createCurrency ("Zetacoin",            0x50, 0xE0, "8",    "a"    , "ZRU6TP8NLzoyey4DPPaa3uCCgDNDc96PXJ"),



    Bitcoin.currency.createCurrency ("Testnet Bitcoin",     0x6f, 0xef, "9",    "c"    , null),
    Bitcoin.currency.createCurrency ("Testnet Dogecoin",    0x71, 0xf1, "9",    "c"    , null),
    Bitcoin.currency.createCurrency ("Testnet MonetaryUnit",0x26, 0x40, "3",    "A"    , null),
    Bitcoin.currency.createCurrency ("Testnet PIVX",        0x8b, 0xef, "9",    "c"    , null),
    Bitcoin.currency.createCurrency ("Testnet WACoins",     0x51, 0xd1, "8",    "[XY]" , null)
                   ];
