'use strict';

import UTF8 from "../vendor/utf8";

const JPEG_SOS = 0xFFDA;
const JPEG_APP1 = 0xFFE1;

const NS_IRI_X = "adobe:ns:meta/";
const NS_IRI_RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const NS_IRI_XMP = "http://ns.adobe.com/xap/1.0/";
const NS_IRI_PHOTOBLOCK = "http://ns.photoblock.org/xmp/1.0/";

const NS_X = "x";
const NS_PHOTOBLOCK = "photoblock";
const NS_RDF = "rdf";
const NS_XML = "xmlns";
const NS_XMP = "xmp";
const NS_ABOUT = "about";

const TAG_X_XMPMETA = NS_X + ":xmpmeta";
const TAG_RDF_RDF = NS_RDF + ":RDF"; 
const TAG_RDF_DESCRIPTION = NS_RDF + ":Description";
const TAG_RDF_SEQ = NS_RDF + ":Seq";
const TAG_RDF_LI = NS_RDF + ":li";
const TAG_XPACKET = "xpacket";
const XMP_GUID = "W5M0MpCehiHzreSzNTczkc9d";

export default class Xmp {
  constructor(currentContext, contexts) {

    this.contexts = contexts;
    this.currentContext = currentContext;
    this.xmpPacket = {};

  }
  
  getAccounts(buffer) {
    this._parseBuffer(buffer, true);
    let hasAccounts = false;
    let accounts = {};
    Object.keys(this.contexts).map((context) => {
      if (this.contexts[context].accounts.length > 0) {
        hasAccounts = true;
        accounts[context] = this.contexts[context].accounts;
      }
    });
    return hasAccounts ? accounts : null;
  }

  addAccounts(buffer, contextAccounts) {

  
    // Read the image
    this._parseBuffer(buffer, false);
    if (!this.xmpPacket.hasOwnProperty("doc")) {
      return false;
    }

    let isValid = true;

    let contextNames = Object.keys(contextAccounts);
    contextNames.map((contextName) => {

      let account = contextAccounts[contextName];

      // Validate
      if (!this.contexts.hasOwnProperty(contextName)) {
        return false;
      }

      // Validate that all attributes are present
      this.contexts[contextName].attributes.map((attribute) => {
        if (!account.hasOwnProperty(attribute) || (account[attribute] === null)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Validate that the account does not allready exist
        let attribute = this.contexts[contextName].attributes[0];
        this.contexts[contextName].accounts.map((acct) => {
          if (acct[attribute] === account[attribute]) {
            isValid = false;
          }
        });  
      }

      if (isValid) {
        this.contexts[contextName].accounts.push(account);
      }

    });
  

    if (isValid) {

      this.xmpPacket.doc = _updateXmpPacketDoc(this.xmpPacket.doc, this.contexts);

      if (this.xmpPacket.xmpMarker === null) {
        this.xmpPacket.xmpMarker = this.xmpPacket.sosMarker; // If no XMP packet, insert before start of stream
        this.xmpPacket.xmpLength = 0;
      }

      // Bytes before existing XMP packet
      let preBytes = new Uint8Array(buffer, 0, this.xmpPacket.xmpMarker);

      // Bytes after existing XMP packet
      let postBytes = new Uint8Array(buffer, this.xmpPacket.xmpMarker + this.xmpPacket.xmpLength);

      // Bytes for new XMP packet
      let newXmpText = new XMLSerializer().serializeToString(this.xmpPacket.doc);
      newXmpText = newXmpText.replace(/>\s*/g, ">").replace(/\s*</g, "<"); // Strip whitespace
      let xmpBytes = Uint8Array.from(UTF8.setBytesFromString("XXXX" + NS_IRI_XMP + "\0" + newXmpText)); //XXXX is placeholder for FFE1 marker followed by length (2 bytes)
      let newXmpDV = new DataView(xmpBytes.buffer);
      newXmpDV.setUint16(0, JPEG_APP1);
      newXmpDV.setUint16(2, xmpBytes.length - 2); // Exclude the marker bytes, but include the length bytes

      // Payload = preBytes + new XMP bytes + postBytes
//      let payloadLength = this.xmpPacket.dataLength - this.xmpPacket.xmpLength + newXmpDV.byteLength;
      let payloadLength = preBytes.length + xmpBytes.length + postBytes.length;
      let payload = new Uint8Array(payloadLength); 
      payload.set(preBytes, 0);
      payload.set(xmpBytes, this.xmpPacket.xmpMarker);
      payload.set(postBytes, this.xmpPacket.xmpMarker + newXmpDV.byteLength);

      delete this.xmpPacket; // Cleanup

      return payload.buffer;
    }

    return null;

    // function buf2hex(buffer) { // buffer is an ArrayBuffer
    //   return Array.prototype.map.call(new Uint8Array(buffer), x => ("00" + x.toString(16)).slice(-2)).join(" ").toUpperCase();
    // }


    function _updateXmpPacketDoc(xmpDoc, contexts) {

      if (xmpDoc === null) {
        let xmpText =
          `<?${TAG_XPACKET} begin=\"\" id=\"${XMP_GUID}\"?><${TAG_X_XMPMETA} ${NS_XML}:${NS_X}=\"${NS_IRI_X}\">
          <${TAG_RDF_RDF} ${NS_XML}:${NS_RDF}=\"${NS_IRI_RDF}\">
            <${TAG_RDF_DESCRIPTION} ${NS_RDF}:${NS_ABOUT}=\"\" ${NS_XML}:${NS_XMP}=\"${NS_IRI_XMP}\"></${TAG_RDF_DESCRIPTION}>
          </${TAG_RDF_RDF}>
        </${TAG_X_XMPMETA}><?${TAG_XPACKET} end=\"w\"?>`;

        xmpDoc = new DOMParser().parseFromString(xmpText, "text/xml")
      }

      let rdfDescriptions = xmpDoc.getElementsByTagName(TAG_RDF_DESCRIPTION);
      let inserted = false;
      Array.prototype.forEach.call(rdfDescriptions, (rdfDescription) => {

        if (!inserted) {
          Array.prototype.forEach.call(rdfDescription.attributes, (attribute) => {
            if (attribute.value.indexOf(NS_IRI_XMP) === 0) {
              // This is the target rdf:Description block
              if (!inserted) {

                for (let contextName in contexts) {
                  if (!contexts.hasOwnProperty(contextName)) {
                    continue;
                  }
                  let context = contexts[contextName];

                  if (context.accounts.length === 0) {
                    continue
                  };

                  // Add the PhotoBlock namespace only if there is at least one valid account
                  if (!inserted) {
                    inserted = true;
                    let nsAttribute = xmpDoc.createAttribute(NS_XML + ":" + NS_PHOTOBLOCK);
                    nsAttribute.nodeValue = NS_IRI_PHOTOBLOCK;
                    rdfDescription.setAttributeNode(nsAttribute);
                  }

                  let photoBlock = xmpDoc.createElement(NS_PHOTOBLOCK + ":" + contextName);
                  let photoBlockNS = xmpDoc.createAttribute(NS_XML + ":" + contextName.toLowerCase());
                  photoBlockNS.nodeValue = NS_IRI_PHOTOBLOCK + contextName + "#";
                  photoBlock.setAttributeNode(photoBlockNS);
                  rdfDescription.appendChild(photoBlock);

                  let seq = xmpDoc.createElement(TAG_RDF_SEQ);
                  photoBlock.appendChild(seq);

                  context.accounts.map((account) => {
                    let li = xmpDoc.createElement(TAG_RDF_LI);
                    for (let attribute in account) {
                      if ((attribute !== null) && account.hasOwnProperty(attribute)) {
                        let newAttribute = xmpDoc.createAttribute(contextName.toLowerCase() + ":" + attribute);
                        newAttribute.nodeValue = account[attribute];
                        li.setAttributeNode(newAttribute);
                      }
                    }
                    seq.appendChild(li);
                  });
                }
              }
            }
          });
        }
      });

      return xmpDoc;
    }
  }


  _parseBuffer(buffer, readOnly) {

    let data = new DataView(buffer);
    let offset = 2;
    this.xmpPacket = {
      doc: null,
      xmpMarker: null,
      sosMarker: null,
      xmpLength: null,
      dataLength: null
    }

    while (true) {
      // Offset is now at marker (4 bytes)
      let start = offset;
      let id = _read16();
      let length = _read16() - 2;
      if ((offset + length) >= data.byteLength) {
        //throw new Error("Jpeg section ran over end of file.");
        break;
      }

      if (id === JPEG_SOS) {
        this.xmpPacket.sosMarker = start;
        break;
      } else if ((id === JPEG_APP1) && (this.xmpPacket.doc === null)) {
        let str = "";
        try {
          str = _readStr(true);
        } catch (e) {
          // Ignore failures to read strings.
        }

        let xmpText = null;
        if (str == NS_IRI_XMP) {

          // We are now in first XMP packet, which could contain Photoblock data
          // Photoblock only supports data in the first XMP packet in the file
          try {
            let view = new DataView(data.buffer, data.byteOffset + offset, length);

            let _offset = NS_IRI_XMP.length + 1; // The header is null terminated.
            let buffer = new Uint8Array(view.buffer, view.byteOffset + _offset, view.byteLength - _offset);
            xmpText = UTF8.getStringFromBytes(buffer);            

            // Extract the non-header, XML portion of the packet
            let begin = text.indexOf("<" + TAG_X_XMPMETA);
            let end = text.indexOf(TAG_X_XMPMETA + ">");
            if ((begin >= 0) && (end > begin)) {
              text = text.substring(begin, end + TAG_X_XMPMETA.length + 1);
            }
          } catch (e) {
            // Ignore parsing errors...we can't do anything if file has bad data
          }

          if (xmpText !== null) {

            // Get a DOM representation of the XML
            this.xmpPacket.doc = new DOMParser().parseFromString(xmpText, "text/xml");

            // Parse XML and find all accounts in XMP packet
            _parseContextAccounts(this.xmpPacket.doc, this.contexts);

            if (readOnly) {
              delete this.xmpPacket; // Free memory
              break;
            } else {
              // Strip all PhotoBlock references in anticipation of adding more accounts in future calls
              _stripPhotoblockReferences(this.xmpPacket.doc, this.contexts);
              this.xmpPacket.xmpMarker = start;
              this.xmpPacket.xmpLength = length + 4; // Add 2 bytes for length and 2 bytes for marker at start of packet
              this.xmpPacket.dataLength = data.byteLength;

            }
            // If not readOnly continue while loop looking for JPEG_SOS marker
          }
        }
      }
      offset += length;
    }

    // Release image bytes
    data = null;


    function _parseContextAccounts(xmpDoc, contexts) {

      for (let contextName in contexts) {
        if (!contexts.hasOwnProperty(contextName)) {
          continue;
        }
        let context = contexts[contextName];
        context.accounts = [];

        // Find photoblock:* elements which are the main wrapper
        let photoBlocks = xmpDoc.getElementsByTagName(NS_PHOTOBLOCK + ":" + context.name);
        Array.prototype.forEach.call(photoBlocks, (photoBlock) => {

          // Find nested rdf:Seq element needed for collections
          let seqs = photoBlock.getElementsByTagName(TAG_RDF_SEQ);
          Array.prototype.forEach.call(seqs, (seq) => {

            // Find collection of nested rdf:li elements which contain the info we need
            let items = seq.getElementsByTagName(TAG_RDF_LI);
            Array.prototype.forEach.call(items, (item) => {

              if (item.attributes.length > 0) {
                // Empty account representation
                let account = {};
                context.attributes.map((attribute) => {
                  account[attribute] = null;
                });

                // Capture attributes that are defined for the context
                Array.prototype.forEach.call(item.attributes, (attribute) => {
                  // http://ns.photoblock.org/xmp/1.0/Ethereum#
                  if (attribute.namespaceURI === `${NS_IRI_PHOTOBLOCK}${context.name}#`) {
                    if (account.hasOwnProperty(attribute.localName)) {
                      account[attribute.localName] = attribute.value;
                    }
                  }
                });

                // Deduplication. The first attribute defined for a context is considered the key
                // attribute. If it already exists, we skip adding it to the accounts collection
                let keyAttribute = context.attributes[0];
                if (context.accounts.filter((a) => {
                    return a[keyAttribute] === account[keyAttribute]
                  }).length === 0) {
                    context.accounts.push(account);
                }
              }
            });
          });
        });
      };


    }

    function _stripPhotoblockReferences(xmpDoc, contexts) {

      // Strip all namespace attributes from rdf:Description nodes
      let rdfDescriptions = xmpDoc.getElementsByTagName(TAG_RDF_DESCRIPTION);
      Array.prototype.forEach.call(rdfDescriptions, (rdfDescription) => {
        let removeBag = [];
        Array.prototype.forEach.call(rdfDescription.attributes, (attribute) => {
          if (attribute.value.indexOf(NS_IRI_PHOTOBLOCK) === 0) {
            removeBag.push(attribute);
          }
        });
        removeBag.map((attribute) => {
          rdfDescription.removeAttribute(attribute.name);
        });
      });

      for (let contextName in contexts) {
        if (!contexts.hasOwnProperty(contextName)) {
          continue;
        }
        let context = contexts[contextName];
        let photoBlocks = xmpDoc.getElementsByTagName(NS_PHOTOBLOCK + ":" + context.name);
        Array.prototype.forEach.call(photoBlocks, (photoBlock) => {
          photoBlock.parentNode.removeChild(photoBlock);
        });
      }
    }

    /* Begin: Copyright (c) 2018 Dave Townsend
      Source: https://github.com/FractalBrew/media-metadata
      Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
    */

    function _readStr(peek = false) {
      let _offset = offset;
      let bytes = [];
      let byte = _read8();
      while (byte != 0 && (offset < data.byteLength)) {
        bytes.push(byte);
        byte = _read8();
      }

      if (byte != 0) {
        throw new Error("String never terminated.");
      }

      if (peek) {
        offset = _offset;
      }

      return String.fromCharCode(...bytes);
    }

    function _read8(peek = false) {
      let value = data.getUint8(offset);

      if (!peek) {
        offset += 1;
      }

      return value;
    }

    function _read16(peek = false) {
      let value = data.getUint16(offset);

      if (!peek) {
        offset += 2;
      }

      return value;
    }

    /* End: Copyright (c) 2018 Dave Townsend   */

  }

}
