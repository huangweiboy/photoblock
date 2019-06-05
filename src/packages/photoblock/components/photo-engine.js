'use strict';
import PB from '../core/constants';
import Xmp from './xmp';
import photoblockTemplate from '../img/photoblock-template.png';
import blake from 'blakejs';

export default class PhotoEngine {
    constructor(buffer, contexts) {

        this.buffer = buffer;
        this.contexts = contexts;
        this.sliceHashes = [];
    }

    static hash(input) {
        return blake.blake2s(input);
    }

    static hashHex(input) {
        return blake.blake2sHex(input);
    }

    getDataUri(callback) {
        let fr = new FileReader();
        fr.onload = (e) => {
            callback(e.target.result);
        }
        let blob = new Blob([this.buffer], {
            type: 'image/jpeg'
        });
        fr.readAsDataURL(blob);
    }

    getThumbDataUri(callback) {

        let self = this;
        let canvas = document.createElement('canvas');
        canvas.width = PB.PHOTO_INFO.THUMB_WIDTH;
        canvas.height = PB.PHOTO_INFO.THUMB_HEIGHT;
        let ctx = canvas.getContext('2d');
        let photo = document.createElement('img');

        photo.onload = () => {
            let imgInfo = self._coverRegion(canvas.width, canvas.height, photo.width, photo.height);
            ctx.drawImage(photo, imgInfo.offsetX, imgInfo.offsetY, imgInfo.width, imgInfo.height);
            callback(canvas.toDataURL());
        }
        self.getDataUri(img => photo.src = img);

    }

    getAccountSeed(context, hdInfo) {

        let count = context.count < 1 ? 1 : context.count;
        if (count > 10) {
            count = 10;
        }
        return {
            index: hdInfo.index,
            entropy: hdInfo.hash,
            path: context.hdPath,
            count: count
        }

    }

    unlockPhotoBlock(context, emojiKey, xmpAccounts) {
        let self = this;
        try {
            if (xmpAccounts !== null) {
                let hdInfo = self._getPhotoBlockEntropy(emojiKey);

                let accountSeed = self.getAccountSeed(context, hdInfo);
                let pbAccounts = context.handlers.generateAccounts(accountSeed);
                if (pbAccounts === null) { return null; }
                let pbAccount = pbAccounts[0];
                let attributes = Object.keys(context.attributes);
                let isMatch = true;
                for(let a=0; a<attributes.length; a++) {
                    let attribute = context.attributes[a];
                    if (attribute.indexOf('\'') === 0) { continue; }
                    if (!xmpAccounts[0].hasOwnProperty(attribute)) {
                        isMatch = false;
                        break;
                    }
                    if (xmpAccounts[0][attribute] !== PhotoEngine.hashHex(pbAccount[attribute])) {
                        isMatch = false;
                        break;
                    }
                }
                if (isMatch) {
                    return pbAccount;
                }                    
            }
        } catch (e) {
        }
        return null;
    }

    createPhotoBlockImage(emojiKey, callback) {

        let self = this;
        let canvas = document.createElement('canvas');
        canvas.width = PB.PHOTO_INFO.FRAME_WIDTH;
        canvas.height = PB.PHOTO_INFO.FRAME_HEIGHT;
        let ctx = canvas.getContext('2d');
        let photo = document.createElement('img');
        let frame = document.createElement('img');
        let contextNames = Object.keys(self.contexts);
        let contextImages = {};


        // First: Draw the photo
        photo.onload = () => {
            let imgInfo = self._coverRegion(canvas.width, canvas.height, photo.width, photo.height);
            ctx.drawImage(photo, imgInfo.offsetX, imgInfo.offsetY, imgInfo.width, imgInfo.height);
            frame.src = photoblockTemplate;
        }

        // Second: Draw the frame
        frame.onload = () => {
            ctx.drawImage(frame, 0, 0);
            _loadAll(contextNames); // Loads all the context icons
        }

        // Start the process here
        self.getDataUri(img => photo.src = img);


        // This is the last step of the PhotoBlock photo creation. Each of the context logos
        // is drawn on the bottom white bar. The canvas image is extracted to a dataUri and
        // then converted to an arraybuffer that the XMP class can process. The photo pixels
        // are sliced into nine equal sections and hashed. They will be re-hashed with the 
        // EmojiKey for creating the entropy used to generate the mnemonic for account 
        // creation. The XMP class calls the handler for each context and adds an account
        // and then the completed PhotoBlock is downloaded.

        const _finalizeImage = () => {
            const yPos = canvas.height - 230;
            const logoSize = 120;
            let xPos = 400;
            contextNames.map((name) => {
                ctx.drawImage(contextImages[name], xPos, yPos, logoSize, logoSize);
                xPos += 150;
            });

            let pb = canvas.toDataURL('image/jpeg');
            self.buffer = _dataUriToArrayBuffer(pb);

            // Clean-up
            photo = null;
            frame = null;
            canvas = null;

            // It's very important that all binary image data usage related to account generation
            // happens after the image is extracted from the canvas. This is because we don't trust
            // the canvas implementation to be consistent across browsers. Once the JPEG is extracted
            // from the canvas, we can safely use the binary (pixel) data because that will be
            // persisted on disk and will remain unchanged regardless of browser.
            let hdInfo = self._getPhotoBlockEntropy(emojiKey);

            let fileNameSuffix = '';
            let contextAccounts = {};
            contextNames.map((contextName) => {
                let context = self.contexts[contextName];
                let accountSeed = self.getAccountSeed(context, hdInfo);
                let accounts = context.handlers.generateAccounts(accountSeed);
                contextAccounts[contextName] = []
                if (accounts !== null) {
                    for(let a=0; a<accounts.length; a++) {
                        let account = accounts[a];
                        if (account.userId && (account.userId !== null) && (account.userId !== '')) {
                            fileNameSuffix = account.userId;
                        }    
                        Object.keys(account).map((key) => {
                            account[key] = PhotoEngine.hashHex(account[key]);
                        });    
                        contextAccounts[contextName].push(account);
                    }
                }    
            });
            self.buffer = Xmp.addAccounts(self.buffer, self.contexts, contextAccounts);

            if (self.buffer !== null) {
                if (_isMobile()) {
                    _savePhotoBlockMobile(fileNameSuffix);
                } else {
                    _savePhotoBlock(fileNameSuffix);
                }
                callback();
            } else {
                callback('An error occurred');
            }
        }

        // https://codereview.stackexchange.com/questions/128587/check-if-images-are-loaded-es6-promises
        const _loadImage = name => {
            return new Promise(resolve => {
                const img = new Image();
                contextImages[name] = img;
                img.onload = () => {
                    resolve(name);
                }
                img.onerror = () => resolve(() => {
                    throw `Error loading ${name}`
                });
                img.src = self.contexts[name].logoUrl; 
            });
        }

        const _loadAll = (names) => Promise
            .all(names.map(_loadImage))
            .then(() => {
                _finalizeImage();
            });


        const _isMobile = () => {
            return (navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/webOS/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i) ||
                navigator.userAgent.match(/BlackBerry/i) ||
                navigator.userAgent.match(/Windows Phone/i));
        }


        const _dataUriToArrayBuffer = (dataUri) => {
            let byteString = null;
            if (dataUri.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataUri.split(',')[1]);
            else
                byteString = unescape(dataUri.split(',')[1]);

            // separate out the mime component
            //let mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to an ArrayBuffer
            let arrayBuffer = new ArrayBuffer(byteString.length);
            let ia = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return arrayBuffer;
        }


        const _savePhotoBlock = (suffix) => {
            let self = this;
            if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE11 support

                let blob = new Blob([self.buffer], {
                    type: 'image/jpeg'
                });
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                let a = document.createElement('a');
                document.body.appendChild(a);
                a.style = 'display: none';
                a.download = PB.DEFAULT_FILE_NAME.replace(PB.FILE_NAME_SUFFIX_PLACEHOLDER, suffix);
                a.setAttribute('rel', 'noopener noreferrer');
                _getBlobUri((img) => {
                    a.href = img;
                    a.click();
                });
            }
        }

        const _savePhotoBlockMobile = (suffix) => {
            let self = this;
            let fileName = PB.DEFAULT_FILE_NAME.replace(PB.FILE_NAME_SUFFIX_PLACEHOLDER, suffix).replace(' ()', '');
            // other browsers
            let file = new File([self.buffer], fileName, {
                type: 'image/jpeg'
            });
            let exportUrl = (window.webkitURL || window.URL).createObjectURL(file);
            window.location.assign(exportUrl);
            window.setTimeout(() => {
                (window.webkitURL || window.URL).revokeObjectURL(exportUrl);
            }, 5000);

        }


        const _getBlobUri = (callback) => {
            let blob = new Blob([this.buffer], {
                type: 'image/jpeg'
            });
            callback((window.webkitURL || window.URL).createObjectURL(blob));
            window.setTimeout(() => {
                (window.webkitURL || window.URL).revokeObjectURL(blob);
            }, 5000);
        }


    }


    _coverRegion = (parentWidth, parentHeight, childWidth, childHeight, scale = 1, offsetX = 0.5, offsetY = 0.5) => {
        const childRatio = childWidth / childHeight
        const parentRatio = parentWidth / parentHeight
        let width = parentWidth * scale
        let height = parentHeight * scale

        if (childRatio < parentRatio) {
            height = width / childRatio
        } else {
            width = height * childRatio
        }

        return {
            width,
            height,
            offsetX: (parentWidth - width) * offsetX,
            offsetY: (parentHeight - height) * offsetY
        }

    }

    // Paths reference:  https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 
    _getPhotoBlockEntropy(emojiKey) {

        if (emojiKey.length < PB.REQUIRED_EMOJIS) {
            return null;
        }

        let hashes = [];
        let idx = 0;
        let combinedHash = '';

        let cells = [];
        emojiKey.map((item, index) => {
            let hash = item.emoji;
            hashes.push({
                cell: item.cell,
                hash: hash
            });
            cells.push(item.cell);

            if (index === (emojiKey.length - 1)) {
                // The index is the char code of the last character of the last emoji item
                idx = item.emoji[item.emoji.length - 1].charCodeAt();
            }
        });

        const _generateSliceHashes = (cells) => {

            let self = this;
            let decoded = self.decode(self.buffer);
            const bytesPerSlice = PB.PHOTO_INFO.FRAME_WIDTH * PB.PHOTO_INFO.SLICE_ROWS * PB.PHOTO_INFO.BYTES_PER_PIXEL;
            let sliceHashes = [];
            let last = -1;
            for (let s = 0; s < 9; s++) {
                last++;
                let hash = null;
                if (cells.indexOf(s) > -1) {
                    let slice = decoded.data.slice(last, last + PB.PHOTO_INFO.SLICE_HASH_BYTES);
                    hash = PhotoEngine.hashHex(slice);
                }
                last = last + bytesPerSlice;
                sliceHashes.push(hash);
            }

            return sliceHashes;
        }

        let imageSliceHashes = _generateSliceHashes(cells);
        hashes.map((item) => {
            let cell = item.cell;
            let emojiHash = item.hash;
            let imageHash = imageSliceHashes[cell]; // Hash of image for slice referenced by emoji cell (0..8)
            combinedHash += emojiHash + imageHash;
        });

        return {
            hash: PhotoEngine.hash(combinedHash),
            index: idx
        }

    }





    /* -*- tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
    /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
    /*
    Copyright 2011 notmasteryet

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
    */

    // - The JPEG specification can be found in the ITU CCITT Recommendation T.81
    //   (www.w3.org/Graphics/JPEG/itu-t81.pdf)
    // - The JFIF specification can be found in the JPEG File Interchange Format
    //   (www.w3.org/Graphics/JPEG/jfif3.pdf)
    // - The Adobe Application-Specific JPEG markers in the Supporting the DCT Filters
    //   in PostScript Level 2, Technical Note #5116
    //   (partners.adobe.com/public/developer/en/ps/sdk/5116.DCT_Filter.pdf)

    decode(jpegData, opts) {


        let JpegImage = (function jpegImage() {
            "use strict";
            var dctZigZag = new Int32Array([
                0,
                1, 8,
                16, 9, 2,
                3, 10, 17, 24,
                32, 25, 18, 11, 4,
                5, 12, 19, 26, 33, 40,
                48, 41, 34, 27, 20, 13, 6,
                7, 14, 21, 28, 35, 42, 49, 56,
                57, 50, 43, 36, 29, 22, 15,
                23, 30, 37, 44, 51, 58,
                59, 52, 45, 38, 31,
                39, 46, 53, 60,
                61, 54, 47,
                55, 62,
                63
            ]);

            var dctCos1 = 4017 // cos(pi/16)
            var dctSin1 = 799 // sin(pi/16)
            var dctCos3 = 3406 // cos(3*pi/16)
            var dctSin3 = 2276 // sin(3*pi/16)
            var dctCos6 = 1567 // cos(6*pi/16)
            var dctSin6 = 3784 // sin(6*pi/16)
            var dctSqrt2 = 5793 // sqrt(2)
            var dctSqrt1d2 = 2896 // sqrt(2) / 2

            function constructor() {}

            function buildHuffmanTable(codeLengths, values) {
                var k = 0,
                    code = [],
                    i, j, length = 16;
                while (length > 0 && !codeLengths[length - 1])
                    length--;
                code.push({
                    children: [],
                    index: 0
                });
                var p = code[0],
                    q;
                for (i = 0; i < length; i++) {
                    for (j = 0; j < codeLengths[i]; j++) {
                        p = code.pop();
                        p.children[p.index] = values[k];
                        while (p.index > 0) {
                            p = code.pop();
                        }
                        p.index++;
                        code.push(p);
                        while (code.length <= i) {
                            code.push(q = {
                                children: [],
                                index: 0
                            });
                            p.children[p.index] = q.children;
                            p = q;
                        }
                        k++;
                    }
                    if (i + 1 < length) {
                        // p here points to last code
                        code.push(q = {
                            children: [],
                            index: 0
                        });
                        p.children[p.index] = q.children;
                        p = q;
                    }
                }
                return code[0].children;
            }

            function decodeScan(data, offset,
                frame, components, resetInterval,
                spectralStart, spectralEnd,
                successivePrev, successive) {
                var precision = frame.precision;
                var samplesPerLine = frame.samplesPerLine;
                var scanLines = frame.scanLines;
                var mcusPerLine = frame.mcusPerLine;
                var progressive = frame.progressive;
                var maxH = frame.maxH,
                    maxV = frame.maxV;

                var startOffset = offset,
                    bitsData = 0,
                    bitsCount = 0;

                function readBit() {
                    if (bitsCount > 0) {
                        bitsCount--;
                        return (bitsData >> bitsCount) & 1;
                    }
                    bitsData = data[offset++];
                    if (bitsData == 0xFF) {
                        var nextByte = data[offset++];
                        if (nextByte) {
                            throw new Error("unexpected marker: " + ((bitsData << 8) | nextByte).toString(16));
                        }
                        // unstuff 0
                    }
                    bitsCount = 7;
                    return bitsData >>> 7;
                }

                function decodeHuffman(tree) {
                    var node = tree,
                        bit;
                    while ((bit = readBit()) !== null) {
                        node = node[bit];
                        if (typeof node === 'number')
                            return node;
                        if (typeof node !== 'object')
                            throw new Error("invalid huffman sequence");
                    }
                    return null;
                }

                function receive(length) {
                    var n = 0;
                    while (length > 0) {
                        var bit = readBit();
                        if (bit === null) return;
                        n = (n << 1) | bit;
                        length--;
                    }
                    return n;
                }

                function receiveAndExtend(length) {
                    var n = receive(length);
                    if (n >= 1 << (length - 1))
                        return n;
                    return n + (-1 << length) + 1;
                }

                function decodeBaseline(component, zz) {
                    var t = decodeHuffman(component.huffmanTableDC);
                    var diff = t === 0 ? 0 : receiveAndExtend(t);
                    zz[0] = (component.pred += diff);
                    var k = 1;
                    while (k < 64) {
                        var rs = decodeHuffman(component.huffmanTableAC);
                        var s = rs & 15,
                            r = rs >> 4;
                        if (s === 0) {
                            if (r < 15)
                                break;
                            k += 16;
                            continue;
                        }
                        k += r;
                        var z = dctZigZag[k];
                        zz[z] = receiveAndExtend(s);
                        k++;
                    }
                }

                function decodeDCFirst(component, zz) {
                    var t = decodeHuffman(component.huffmanTableDC);
                    var diff = t === 0 ? 0 : (receiveAndExtend(t) << successive);
                    zz[0] = (component.pred += diff);
                }

                function decodeDCSuccessive(component, zz) {
                    zz[0] |= readBit() << successive;
                }
                var eobrun = 0;

                function decodeACFirst(component, zz) {
                    if (eobrun > 0) {
                        eobrun--;
                        return;
                    }
                    var k = spectralStart,
                        e = spectralEnd;
                    while (k <= e) {
                        var rs = decodeHuffman(component.huffmanTableAC);
                        var s = rs & 15,
                            r = rs >> 4;
                        if (s === 0) {
                            if (r < 15) {
                                eobrun = receive(r) + (1 << r) - 1;
                                break;
                            }
                            k += 16;
                            continue;
                        }
                        k += r;
                        var z = dctZigZag[k];
                        zz[z] = receiveAndExtend(s) * (1 << successive);
                        k++;
                    }
                }
                var successiveACState = 0,
                    successiveACNextValue;

                function decodeACSuccessive(component, zz) {
                    var k = spectralStart,
                        e = spectralEnd,
                        r = 0;
                    while (k <= e) {
                        var z = dctZigZag[k];
                        var direction = zz[z] < 0 ? -1 : 1;
                        switch (successiveACState) {
                            case 0: // initial state
                                var rs = decodeHuffman(component.huffmanTableAC);
                                var s = rs & 15,
                                    r = rs >> 4;
                                if (s === 0) {
                                    if (r < 15) {
                                        eobrun = receive(r) + (1 << r);
                                        successiveACState = 4;
                                    } else {
                                        r = 16;
                                        successiveACState = 1;
                                    }
                                } else {
                                    if (s !== 1)
                                        throw new Error("invalid ACn encoding");
                                    successiveACNextValue = receiveAndExtend(s);
                                    successiveACState = r ? 2 : 3;
                                }
                                continue;
                            case 1: // skipping r zero items
                            case 2:
                                if (zz[z])
                                    zz[z] += (readBit() << successive) * direction;
                                else {
                                    r--;
                                    if (r === 0)
                                        successiveACState = successiveACState == 2 ? 3 : 0;
                                }
                                break;
                            case 3: // set value for a zero item
                                if (zz[z])
                                    zz[z] += (readBit() << successive) * direction;
                                else {
                                    zz[z] = successiveACNextValue << successive;
                                    successiveACState = 0;
                                }
                                break;
                            case 4: // eob
                                if (zz[z])
                                    zz[z] += (readBit() << successive) * direction;
                                break;
                        }
                        k++;
                    }
                    if (successiveACState === 4) {
                        eobrun--;
                        if (eobrun === 0)
                            successiveACState = 0;
                    }
                }

                function decodeMcu(component, decode, mcu, row, col) {
                    var mcuRow = (mcu / mcusPerLine) | 0;
                    var mcuCol = mcu % mcusPerLine;
                    var blockRow = mcuRow * component.v + row;
                    var blockCol = mcuCol * component.h + col;
                    decode(component, component.blocks[blockRow][blockCol]);
                }

                function decodeBlock(component, decode, mcu) {
                    var blockRow = (mcu / component.blocksPerLine) | 0;
                    var blockCol = mcu % component.blocksPerLine;
                    decode(component, component.blocks[blockRow][blockCol]);
                }

                var componentsLength = components.length;
                var component, i, j, k, n;
                var decodeFn;
                if (progressive) {
                    if (spectralStart === 0)
                        decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
                    else
                        decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
                } else {
                    decodeFn = decodeBaseline;
                }

                var mcu = 0,
                    marker;
                var mcuExpected;
                if (componentsLength == 1) {
                    mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
                } else {
                    mcuExpected = mcusPerLine * frame.mcusPerColumn;
                }
                if (!resetInterval) resetInterval = mcuExpected;

                var h, v;
                while (mcu < mcuExpected) {
                    // reset interval stuff
                    for (i = 0; i < componentsLength; i++)
                        components[i].pred = 0;
                    eobrun = 0;

                    if (componentsLength == 1) {
                        component = components[0];
                        for (n = 0; n < resetInterval; n++) {
                            decodeBlock(component, decodeFn, mcu);
                            mcu++;
                        }
                    } else {
                        for (n = 0; n < resetInterval; n++) {
                            for (i = 0; i < componentsLength; i++) {
                                component = components[i];
                                h = component.h;
                                v = component.v;
                                for (j = 0; j < v; j++) {
                                    for (k = 0; k < h; k++) {
                                        decodeMcu(component, decodeFn, mcu, j, k);
                                    }
                                }
                            }
                            mcu++;

                            // If we've reached our expected MCU's, stop decoding
                            if (mcu === mcuExpected) break;
                        }
                    }

                    // find marker
                    bitsCount = 0;
                    marker = (data[offset] << 8) | data[offset + 1];
                    if (marker < 0xFF00) {
                        throw new Error("marker was not found");
                    }

                    if (marker >= 0xFFD0 && marker <= 0xFFD7) { // RSTx
                        offset += 2;
                    } else
                        break;
                }

                return offset - startOffset;
            }

            function buildComponentData(frame, component) {
                var lines = [];
                var blocksPerLine = component.blocksPerLine;
                var blocksPerColumn = component.blocksPerColumn;
                var samplesPerLine = blocksPerLine << 3;
                var R = new Int32Array(64),
                    r = new Uint8Array(64);

                // A port of poppler's IDCT method which in turn is taken from:
                //   Christoph Loeffler, Adriaan Ligtenberg, George S. Moschytz,
                //   "Practical Fast 1-D DCT Algorithms with 11 Multiplications",
                //   IEEE Intl. Conf. on Acoustics, Speech & Signal Processing, 1989,
                //   988-991.
                function quantizeAndInverse(zz, dataOut, dataIn) {
                    var qt = component.quantizationTable;
                    var v0, v1, v2, v3, v4, v5, v6, v7, t;
                    var p = dataIn;
                    var i;

                    // dequant
                    for (i = 0; i < 64; i++)
                        p[i] = zz[i] * qt[i];

                    // inverse DCT on rows
                    for (i = 0; i < 8; ++i) {
                        var row = 8 * i;

                        // check for all-zero AC coefficients
                        if (p[1 + row] == 0 && p[2 + row] == 0 && p[3 + row] == 0 &&
                            p[4 + row] == 0 && p[5 + row] == 0 && p[6 + row] == 0 &&
                            p[7 + row] == 0) {
                            t = (dctSqrt2 * p[0 + row] + 512) >> 10;
                            p[0 + row] = t;
                            p[1 + row] = t;
                            p[2 + row] = t;
                            p[3 + row] = t;
                            p[4 + row] = t;
                            p[5 + row] = t;
                            p[6 + row] = t;
                            p[7 + row] = t;
                            continue;
                        }

                        // stage 4
                        v0 = (dctSqrt2 * p[0 + row] + 128) >> 8;
                        v1 = (dctSqrt2 * p[4 + row] + 128) >> 8;
                        v2 = p[2 + row];
                        v3 = p[6 + row];
                        v4 = (dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128) >> 8;
                        v7 = (dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128) >> 8;
                        v5 = p[3 + row] << 4;
                        v6 = p[5 + row] << 4;

                        // stage 3
                        t = (v0 - v1 + 1) >> 1;
                        v0 = (v0 + v1 + 1) >> 1;
                        v1 = t;
                        t = (v2 * dctSin6 + v3 * dctCos6 + 128) >> 8;
                        v2 = (v2 * dctCos6 - v3 * dctSin6 + 128) >> 8;
                        v3 = t;
                        t = (v4 - v6 + 1) >> 1;
                        v4 = (v4 + v6 + 1) >> 1;
                        v6 = t;
                        t = (v7 + v5 + 1) >> 1;
                        v5 = (v7 - v5 + 1) >> 1;
                        v7 = t;

                        // stage 2
                        t = (v0 - v3 + 1) >> 1;
                        v0 = (v0 + v3 + 1) >> 1;
                        v3 = t;
                        t = (v1 - v2 + 1) >> 1;
                        v1 = (v1 + v2 + 1) >> 1;
                        v2 = t;
                        t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
                        v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
                        v7 = t;
                        t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
                        v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
                        v6 = t;

                        // stage 1
                        p[0 + row] = v0 + v7;
                        p[7 + row] = v0 - v7;
                        p[1 + row] = v1 + v6;
                        p[6 + row] = v1 - v6;
                        p[2 + row] = v2 + v5;
                        p[5 + row] = v2 - v5;
                        p[3 + row] = v3 + v4;
                        p[4 + row] = v3 - v4;
                    }

                    // inverse DCT on columns
                    for (i = 0; i < 8; ++i) {
                        var col = i;

                        // check for all-zero AC coefficients
                        if (p[1 * 8 + col] == 0 && p[2 * 8 + col] == 0 && p[3 * 8 + col] == 0 &&
                            p[4 * 8 + col] == 0 && p[5 * 8 + col] == 0 && p[6 * 8 + col] == 0 &&
                            p[7 * 8 + col] == 0) {
                            t = (dctSqrt2 * dataIn[i + 0] + 8192) >> 14;
                            p[0 * 8 + col] = t;
                            p[1 * 8 + col] = t;
                            p[2 * 8 + col] = t;
                            p[3 * 8 + col] = t;
                            p[4 * 8 + col] = t;
                            p[5 * 8 + col] = t;
                            p[6 * 8 + col] = t;
                            p[7 * 8 + col] = t;
                            continue;
                        }

                        // stage 4
                        v0 = (dctSqrt2 * p[0 * 8 + col] + 2048) >> 12;
                        v1 = (dctSqrt2 * p[4 * 8 + col] + 2048) >> 12;
                        v2 = p[2 * 8 + col];
                        v3 = p[6 * 8 + col];
                        v4 = (dctSqrt1d2 * (p[1 * 8 + col] - p[7 * 8 + col]) + 2048) >> 12;
                        v7 = (dctSqrt1d2 * (p[1 * 8 + col] + p[7 * 8 + col]) + 2048) >> 12;
                        v5 = p[3 * 8 + col];
                        v6 = p[5 * 8 + col];

                        // stage 3
                        t = (v0 - v1 + 1) >> 1;
                        v0 = (v0 + v1 + 1) >> 1;
                        v1 = t;
                        t = (v2 * dctSin6 + v3 * dctCos6 + 2048) >> 12;
                        v2 = (v2 * dctCos6 - v3 * dctSin6 + 2048) >> 12;
                        v3 = t;
                        t = (v4 - v6 + 1) >> 1;
                        v4 = (v4 + v6 + 1) >> 1;
                        v6 = t;
                        t = (v7 + v5 + 1) >> 1;
                        v5 = (v7 - v5 + 1) >> 1;
                        v7 = t;

                        // stage 2
                        t = (v0 - v3 + 1) >> 1;
                        v0 = (v0 + v3 + 1) >> 1;
                        v3 = t;
                        t = (v1 - v2 + 1) >> 1;
                        v1 = (v1 + v2 + 1) >> 1;
                        v2 = t;
                        t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
                        v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
                        v7 = t;
                        t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
                        v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
                        v6 = t;

                        // stage 1
                        p[0 * 8 + col] = v0 + v7;
                        p[7 * 8 + col] = v0 - v7;
                        p[1 * 8 + col] = v1 + v6;
                        p[6 * 8 + col] = v1 - v6;
                        p[2 * 8 + col] = v2 + v5;
                        p[5 * 8 + col] = v2 - v5;
                        p[3 * 8 + col] = v3 + v4;
                        p[4 * 8 + col] = v3 - v4;
                    }

                    // convert to 8-bit integers
                    for (i = 0; i < 64; ++i) {
                        var sample = 128 + ((p[i] + 8) >> 4);
                        dataOut[i] = sample < 0 ? 0 : sample > 0xFF ? 0xFF : sample;
                    }
                }

                var i, j;
                for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
                    var scanLine = blockRow << 3;
                    for (i = 0; i < 8; i++)
                        lines.push(new Uint8Array(samplesPerLine));
                    for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) {
                        quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);

                        var offset = 0,
                            sample = blockCol << 3;
                        for (j = 0; j < 8; j++) {
                            var line = lines[scanLine + j];
                            for (i = 0; i < 8; i++)
                                line[sample + i] = r[offset++];
                        }
                    }
                }
                return lines;
            }

            function clampTo8bit(a) {
                return a < 0 ? 0 : a > 255 ? 255 : a;
            }

            constructor.prototype = {
                load: function load(path) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", path, true);
                    xhr.responseType = "arraybuffer";
                    xhr.onload = (function () {
                        // TODO catch parse error
                        var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
                        this.parse(data);
                        if (this.onload)
                            this.onload();
                    }).bind(this);
                    xhr.send(null);
                },
                parse: function parse(data) {
                    var offset = 0,
                        length = data.length;

                    function readUint16() {
                        var value = (data[offset] << 8) | data[offset + 1];
                        offset += 2;
                        return value;
                    }

                    function readDataBlock() {
                        var length = readUint16();
                        var array = data.subarray(offset, offset + length - 2);
                        offset += array.length;
                        return array;
                    }

                    function prepareComponents(frame) {
                        var maxH = 0,
                            maxV = 0;
                        var component, componentId;
                        for (componentId in frame.components) {
                            if (frame.components.hasOwnProperty(componentId)) {
                                component = frame.components[componentId];
                                if (maxH < component.h) maxH = component.h;
                                if (maxV < component.v) maxV = component.v;
                            }
                        }
                        var mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / maxH);
                        var mcusPerColumn = Math.ceil(frame.scanLines / 8 / maxV);
                        for (componentId in frame.components) {
                            if (frame.components.hasOwnProperty(componentId)) {
                                component = frame.components[componentId];
                                var blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / maxH);
                                var blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines / 8) * component.v / maxV);
                                var blocksPerLineForMcu = mcusPerLine * component.h;
                                var blocksPerColumnForMcu = mcusPerColumn * component.v;
                                var blocks = [];
                                for (var i = 0; i < blocksPerColumnForMcu; i++) {
                                    var row = [];
                                    for (var j = 0; j < blocksPerLineForMcu; j++)
                                        row.push(new Int32Array(64));
                                    blocks.push(row);
                                }
                                component.blocksPerLine = blocksPerLine;
                                component.blocksPerColumn = blocksPerColumn;
                                component.blocks = blocks;
                            }
                        }
                        frame.maxH = maxH;
                        frame.maxV = maxV;
                        frame.mcusPerLine = mcusPerLine;
                        frame.mcusPerColumn = mcusPerColumn;
                    }
                    var jfif = null;
                    var adobe = null;
                    var pixels = null;
                    var frame, resetInterval;
                    var quantizationTables = [],
                        frames = [];
                    var huffmanTablesAC = [],
                        huffmanTablesDC = [];
                    var fileMarker = readUint16();
                    if (fileMarker != 0xFFD8) { // SOI (Start of Image)
                        throw new Error("SOI not found");
                    }

                    fileMarker = readUint16();
                    while (fileMarker != 0xFFD9) { // EOI (End of image)
                        var i, j, l;
                        switch (fileMarker) {
                            case 0xFF00:
                                break;
                            case 0xFFE0: // APP0 (Application Specific)
                            case 0xFFE1: // APP1
                            case 0xFFE2: // APP2
                            case 0xFFE3: // APP3
                            case 0xFFE4: // APP4
                            case 0xFFE5: // APP5
                            case 0xFFE6: // APP6
                            case 0xFFE7: // APP7
                            case 0xFFE8: // APP8
                            case 0xFFE9: // APP9
                            case 0xFFEA: // APP10
                            case 0xFFEB: // APP11
                            case 0xFFEC: // APP12
                            case 0xFFED: // APP13
                            case 0xFFEE: // APP14
                            case 0xFFEF: // APP15
                            case 0xFFFE: // COM (Comment)
                                var appData = readDataBlock();

                                if (fileMarker === 0xFFE0) {
                                    if (appData[0] === 0x4A && appData[1] === 0x46 && appData[2] === 0x49 &&
                                        appData[3] === 0x46 && appData[4] === 0) { // 'JFIF\x00'
                                        jfif = {
                                            version: {
                                                major: appData[5],
                                                minor: appData[6]
                                            },
                                            densityUnits: appData[7],
                                            xDensity: (appData[8] << 8) | appData[9],
                                            yDensity: (appData[10] << 8) | appData[11],
                                            thumbWidth: appData[12],
                                            thumbHeight: appData[13],
                                            thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                                        };
                                    }
                                }
                                // TODO APP1 - Exif
                                if (fileMarker === 0xFFEE) {
                                    if (appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6F &&
                                        appData[3] === 0x62 && appData[4] === 0x65 && appData[5] === 0) { // 'Adobe\x00'
                                        adobe = {
                                            version: appData[6],
                                            flags0: (appData[7] << 8) | appData[8],
                                            flags1: (appData[9] << 8) | appData[10],
                                            transformCode: appData[11]
                                        };
                                    }
                                }
                                break;

                            case 0xFFDB: // DQT (Define Quantization Tables)
                                var quantizationTablesLength = readUint16();
                                var quantizationTablesEnd = quantizationTablesLength + offset - 2;
                                while (offset < quantizationTablesEnd) {
                                    var quantizationTableSpec = data[offset++];
                                    var tableData = new Int32Array(64);
                                    if ((quantizationTableSpec >> 4) === 0) { // 8 bit values
                                        for (j = 0; j < 64; j++) {
                                            var z = dctZigZag[j];
                                            tableData[z] = data[offset++];
                                        }
                                    } else if ((quantizationTableSpec >> 4) === 1) { //16 bit
                                        for (j = 0; j < 64; j++) {
                                            var z = dctZigZag[j];
                                            tableData[z] = readUint16();
                                        }
                                    } else
                                        throw new Error("DQT: invalid table spec");
                                    quantizationTables[quantizationTableSpec & 15] = tableData;
                                }
                                break;

                            case 0xFFC0: // SOF0 (Start of Frame, Baseline DCT)
                            case 0xFFC1: // SOF1 (Start of Frame, Extended DCT)
                            case 0xFFC2: // SOF2 (Start of Frame, Progressive DCT)
                                readUint16(); // skip data length
                                frame = {};
                                frame.extended = (fileMarker === 0xFFC1);
                                frame.progressive = (fileMarker === 0xFFC2);
                                frame.precision = data[offset++];
                                frame.scanLines = readUint16();
                                frame.samplesPerLine = readUint16();
                                frame.components = {};
                                frame.componentsOrder = [];
                                var componentsCount = data[offset++],
                                    componentId;
                                var maxH = 0,
                                    maxV = 0;
                                for (i = 0; i < componentsCount; i++) {
                                    componentId = data[offset];
                                    var h = data[offset + 1] >> 4;
                                    var v = data[offset + 1] & 15;
                                    var qId = data[offset + 2];
                                    frame.componentsOrder.push(componentId);
                                    frame.components[componentId] = {
                                        h: h,
                                        v: v,
                                        quantizationIdx: qId
                                    };
                                    offset += 3;
                                }
                                prepareComponents(frame);
                                frames.push(frame);
                                break;

                            case 0xFFC4: // DHT (Define Huffman Tables)
                                var huffmanLength = readUint16();
                                for (i = 2; i < huffmanLength;) {
                                    var huffmanTableSpec = data[offset++];
                                    var codeLengths = new Uint8Array(16);
                                    var codeLengthSum = 0;
                                    for (j = 0; j < 16; j++, offset++)
                                        codeLengthSum += (codeLengths[j] = data[offset]);
                                    var huffmanValues = new Uint8Array(codeLengthSum);
                                    for (j = 0; j < codeLengthSum; j++, offset++)
                                        huffmanValues[j] = data[offset];
                                    i += 17 + codeLengthSum;

                                    ((huffmanTableSpec >> 4) === 0 ?
                                        huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] =
                                    buildHuffmanTable(codeLengths, huffmanValues);
                                }
                                break;

                            case 0xFFDD: // DRI (Define Restart Interval)
                                readUint16(); // skip data length
                                resetInterval = readUint16();
                                break;

                            case 0xFFDA: // SOS (Start of Scan)
                                var scanLength = readUint16();
                                var selectorsCount = data[offset++];
                                var components = [],
                                    component;
                                for (i = 0; i < selectorsCount; i++) {
                                    component = frame.components[data[offset++]];
                                    var tableSpec = data[offset++];
                                    component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
                                    component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
                                    components.push(component);
                                }
                                var spectralStart = data[offset++];
                                var spectralEnd = data[offset++];
                                var successiveApproximation = data[offset++];
                                var processed = decodeScan(data, offset,
                                    frame, components, resetInterval,
                                    spectralStart, spectralEnd,
                                    successiveApproximation >> 4, successiveApproximation & 15);
                                offset += processed;
                                break;

                            case 0xFFFF: // Fill bytes
                                if (data[offset] !== 0xFF) { // Avoid skipping a valid marker.
                                    offset--;
                                }
                                break;

                            default:
                                if (data[offset - 3] == 0xFF &&
                                    data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE) {
                                    // could be incorrect encoding -- last 0xFF byte of the previous
                                    // block was eaten by the encoder
                                    offset -= 3;
                                    break;
                                }
                                throw new Error("unknown JPEG marker " + fileMarker.toString(16));
                        }
                        fileMarker = readUint16();
                    }
                    if (frames.length != 1)
                        throw new Error("only single frame JPEGs supported");

                    // set each frame's components quantization table
                    for (var i = 0; i < frames.length; i++) {
                        var cp = frames[i].components;
                        for (var j in cp) {
                            cp[j].quantizationTable = quantizationTables[cp[j].quantizationIdx];
                            delete cp[j].quantizationIdx;
                        }
                    }

                    this.width = frame.samplesPerLine;
                    this.height = frame.scanLines;
                    this.jfif = jfif;
                    this.adobe = adobe;
                    this.components = [];
                    for (var i = 0; i < frame.componentsOrder.length; i++) {
                        var component = frame.components[frame.componentsOrder[i]];
                        this.components.push({
                            lines: buildComponentData(frame, component),
                            scaleX: component.h / frame.maxH,
                            scaleY: component.v / frame.maxV
                        });
                    }
                },
                getData: function getData(width, height) {
                    var scaleX = this.width / width,
                        scaleY = this.height / height;

                    var component1, component2, component3, component4;
                    var component1Line, component2Line, component3Line, component4Line;
                    var x, y;
                    var offset = 0;
                    var Y, Cb, Cr, K, C, M, Ye, R, G, B;
                    var colorTransform;
                    var dataLength = width * height * this.components.length;
                    var data = new Uint8Array(dataLength);
                    switch (this.components.length) {
                        case 1:
                            component1 = this.components[0];
                            for (y = 0; y < height; y++) {
                                component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                                for (x = 0; x < width; x++) {
                                    Y = component1Line[0 | (x * component1.scaleX * scaleX)];

                                    data[offset++] = Y;
                                }
                            }
                            break;
                        case 2:
                            // PDF might compress two component data in custom colorspace
                            component1 = this.components[0];
                            component2 = this.components[1];
                            for (y = 0; y < height; y++) {
                                component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                                component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
                                for (x = 0; x < width; x++) {
                                    Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                                    data[offset++] = Y;
                                    Y = component2Line[0 | (x * component2.scaleX * scaleX)];
                                    data[offset++] = Y;
                                }
                            }
                            break;
                        case 3:
                            // The default transform for three components is true
                            colorTransform = true;
                            // The adobe transform marker overrides any previous setting
                            if (this.adobe && this.adobe.transformCode)
                                colorTransform = true;
                            else if (typeof this.colorTransform !== 'undefined')
                                colorTransform = !!this.colorTransform;

                            component1 = this.components[0];
                            component2 = this.components[1];
                            component3 = this.components[2];
                            for (y = 0; y < height; y++) {
                                component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                                component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
                                component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
                                for (x = 0; x < width; x++) {
                                    if (!colorTransform) {
                                        R = component1Line[0 | (x * component1.scaleX * scaleX)];
                                        G = component2Line[0 | (x * component2.scaleX * scaleX)];
                                        B = component3Line[0 | (x * component3.scaleX * scaleX)];
                                    } else {
                                        Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                                        Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                                        Cr = component3Line[0 | (x * component3.scaleX * scaleX)];

                                        R = clampTo8bit(Y + 1.402 * (Cr - 128));
                                        G = clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                                        B = clampTo8bit(Y + 1.772 * (Cb - 128));
                                    }

                                    data[offset++] = R;
                                    data[offset++] = G;
                                    data[offset++] = B;
                                }
                            }
                            break;
                        case 4:
                            if (!this.adobe)
                                throw 'Unsupported color mode (4 components)';
                            // The default transform for four components is false
                            colorTransform = false;
                            // The adobe transform marker overrides any previous setting
                            if (this.adobe && this.adobe.transformCode)
                                colorTransform = true;
                            else if (typeof this.colorTransform !== 'undefined')
                                colorTransform = !!this.colorTransform;

                            component1 = this.components[0];
                            component2 = this.components[1];
                            component3 = this.components[2];
                            component4 = this.components[3];
                            for (y = 0; y < height; y++) {
                                component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                                component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
                                component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
                                component4Line = component4.lines[0 | (y * component4.scaleY * scaleY)];
                                for (x = 0; x < width; x++) {
                                    if (!colorTransform) {
                                        C = component1Line[0 | (x * component1.scaleX * scaleX)];
                                        M = component2Line[0 | (x * component2.scaleX * scaleX)];
                                        Ye = component3Line[0 | (x * component3.scaleX * scaleX)];
                                        K = component4Line[0 | (x * component4.scaleX * scaleX)];
                                    } else {
                                        Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                                        Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                                        Cr = component3Line[0 | (x * component3.scaleX * scaleX)];
                                        K = component4Line[0 | (x * component4.scaleX * scaleX)];

                                        C = 255 - clampTo8bit(Y + 1.402 * (Cr - 128));
                                        M = 255 - clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                                        Ye = 255 - clampTo8bit(Y + 1.772 * (Cb - 128));
                                    }
                                    data[offset++] = 255 - C;
                                    data[offset++] = 255 - M;
                                    data[offset++] = 255 - Ye;
                                    data[offset++] = 255 - K;
                                }
                            }
                            break;
                        default:
                            throw 'Unsupported color mode';
                    }
                    return data;
                },
                copyToImageData: function copyToImageData(imageData) {
                    var width = imageData.width,
                        height = imageData.height;
                    var imageDataArray = imageData.data;
                    var data = this.getData(width, height);
                    var i = 0,
                        j = 0,
                        x, y;
                    var Y, K, C, M, R, G, B;
                    switch (this.components.length) {
                        case 1:
                            for (y = 0; y < height; y++) {
                                for (x = 0; x < width; x++) {
                                    Y = data[i++];

                                    imageDataArray[j++] = Y;
                                    imageDataArray[j++] = Y;
                                    imageDataArray[j++] = Y;
                                    imageDataArray[j++] = 255;
                                }
                            }
                            break;
                        case 3:
                            for (y = 0; y < height; y++) {
                                for (x = 0; x < width; x++) {
                                    R = data[i++];
                                    G = data[i++];
                                    B = data[i++];

                                    imageDataArray[j++] = R;
                                    imageDataArray[j++] = G;
                                    imageDataArray[j++] = B;
                                    imageDataArray[j++] = 255;
                                }
                            }
                            break;
                        case 4:
                            for (y = 0; y < height; y++) {
                                for (x = 0; x < width; x++) {
                                    C = data[i++];
                                    M = data[i++];
                                    Y = data[i++];
                                    K = data[i++];

                                    R = 255 - clampTo8bit(C * (1 - K / 255) + K);
                                    G = 255 - clampTo8bit(M * (1 - K / 255) + K);
                                    B = 255 - clampTo8bit(Y * (1 - K / 255) + K);

                                    imageDataArray[j++] = R;
                                    imageDataArray[j++] = G;
                                    imageDataArray[j++] = B;
                                    imageDataArray[j++] = 255;
                                }
                            }
                            break;
                        default:
                            throw 'Unsupported color mode';
                    }
                }
            };

            return constructor;
        })();

        var defaultOpts = {
            useTArray: false,
            colorTransform: true
        };
        if (opts) {
            if (typeof opts === 'object') {
                opts = {
                    useTArray: (typeof opts.useTArray === 'undefined' ?
                        defaultOpts.useTArray : opts.useTArray),
                    colorTransform: (typeof opts.colorTransform === 'undefined' ?
                        defaultOpts.colorTransform : opts.colorTransform)
                };
            } else {
                // backwards compatiblity, before 0.3.5, we only had the useTArray param
                opts = defaultOpts;
                opts.useTArray = true;
            }
        } else {
            opts = defaultOpts;
        }

        var arr = new Uint8Array(jpegData);
        var decoder = new JpegImage();
        decoder.parse(arr);
        decoder.colorTransform = opts.colorTransform;

        var image = {
            width: decoder.width,
            height: decoder.height,
            data: opts.useTArray ?
                new Uint8Array(decoder.width * decoder.height * 4) : new Buffer(decoder.width * decoder.height * 4)
        };

        decoder.copyToImageData(image);

        return image;
    }



}