// MIT License

// Copyright (c) 2018 cryptocoinjs

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// https://github.com/cryptocoinjs/eckey

var crypto = require('crypto')
var secp256k1 = require('secp256k1')

function ECKey (bytes, compressed) {
  if (!(this instanceof ECKey)) return new ECKey(bytes, compressed)

  this._compressed = typeof compressed === 'boolean' ? compressed : true
  if (bytes) this.privateKey = bytes
}

Object.defineProperty(ECKey.prototype, 'privateKey', {
  enumerable: true, configurable: true,
  get: function () {
    return this.key
  },
  set: function (bytes) {
    var byteArr
    if (Buffer.isBuffer(bytes)) {
      this.key = bytes
      byteArr = [].slice.call(bytes)
    } else if (bytes instanceof Uint8Array) {
      byteArr = [].slice.call(bytes)
      this.key = new Buffer(byteArr)
    } else if (Array.isArray(bytes)) {
      byteArr = bytes
      this.key = new Buffer(byteArr)
    } else {
      throw new Error('Invalid type. private key bytes must be either a Buffer, Array, or Uint8Array.')
    }

    if (bytes.length !== 32) throw new Error('private key bytes must have a length of 32')

    // _exportKey => privateKey + (0x01 if compressed)
    if (this._compressed) {
      this._exportKey = Buffer.concat([ this.key, new Buffer([0x01]) ])
    } else {
      this._exportKey = Buffer.concat([ this.key ]) // clone key as opposed to passing a reference (relevant to Node.js only)
    }

    // reset
    this._publicKey = null
    this._pubKeyHash = null
  }
})

Object.defineProperty(ECKey.prototype, 'privateExportKey', {
  get: function () {
    return this._exportKey
  }
})

Object.defineProperty(ECKey.prototype, 'publicHash', {
  get: function () {
    return this.pubKeyHash
  }
})

Object.defineProperty(ECKey.prototype, 'pubKeyHash', {
  get: function () {
    if (this._pubKeyHash) return this._pubKeyHash
    var sha = crypto.createHash('sha256').update(this.publicKey).digest()
    this._pubKeyHash = crypto.createHash('rmd160').update(sha).digest()
    return this._pubKeyHash
  }
})

Object.defineProperty(ECKey.prototype, 'publicKey', {
  get: function () {
    if (!this._publicKey) this._publicKey = secp256k1.publicKeyCreate(this.key, this.compressed)
    return new Buffer(this._publicKey)
  }
})

Object.defineProperty(ECKey.prototype, 'compressed', {
  get: function () {
    return this._compressed
  },
  set: function (val) {
    var c = !!val
    if (c === this._compressed) return

    // reset key stuff
    var pk = this.privateKey
    this._compressed = c
    this.privateKey = pk
  }
})

ECKey.prototype.toString = function (format) {
  return this.privateKey.toString('hex')
}

module.exports = ECKey
