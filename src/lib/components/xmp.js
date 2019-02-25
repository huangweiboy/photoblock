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

  }
  
  static getAccounts(buffer, contexts) {

    let jpegPhoto = Xmp._parseBuffer(buffer, contexts, true);
    return jpegPhoto.accounts;

  }

  static addAccounts(buffer, contexts, contextAccounts) {

    // Read the image
    let jpegPhoto = Xmp._parseBuffer(buffer, contexts, false);
    if (jpegPhoto.dataLength === null) {
      return null;
    }

    let isValid = true;
    let contextNames = Object.keys(contextAccounts);
    contextNames.map((contextName) => {

      // Validate
      if (!contexts.hasOwnProperty(contextName)) {
        isValid = false;        
      }

      let account = contextAccounts[contextName];

      if (!account) {
        isValid = null;
      }

      if (isValid) {

        // Validate that all attributes are present
        contexts[contextName].attributes.map((attribute) => {
          if (!account.hasOwnProperty(attribute) || (account[attribute] === null)) {
            isValid = false;
          }
        });
      }

      if (isValid) {
        // Validate that the account does not allready exist
        let attribute = contexts[contextName].attributes[0];
        if (jpegPhoto.accounts.hasOwnProperty(contextName)) {
          jpegPhoto.accounts[contextName].map((acct) => {
            if (acct[attribute] === account[attribute]) {
              isValid = false;
            }
          });    
        } 
      }

      if (isValid) {
        if (!jpegPhoto.accounts.hasOwnProperty(contextName) || (!jpegPhoto.accounts[contextName])) {
          jpegPhoto.accounts[contextName] = [];
        }
        jpegPhoto.accounts[contextName].push(account);
      }

    });
  

    if (isValid) {

      jpegPhoto.doc = _updateXmpPacketDoc(jpegPhoto.doc, jpegPhoto.accounts, contexts);
      if (jpegPhoto.xmpMarker === null) {
        jpegPhoto.xmpMarker = jpegPhoto.sosMarker; // If no XMP packet, insert before start of stream
        jpegPhoto.xmpLength = 0;
      }
      // Bytes before existing XMP packet
      let preBytes = new Uint8Array(buffer, 0, jpegPhoto.xmpMarker);

      // Bytes after existing XMP packet
      let postBytes = new Uint8Array(buffer, jpegPhoto.xmpMarker + jpegPhoto.xmpLength);

      // Bytes for new XMP packet
      let newXmpText = new XMLSerializer().serializeToString(jpegPhoto.doc);
      newXmpText = newXmpText.replace(/>\s*/g, ">").replace(/\s*</g, "<"); // Strip whitespace
      let xmpBytes = Uint8Array.from(UTF8.setBytesFromString("XXXX" + NS_IRI_XMP + "\0" + newXmpText)); //XXXX is placeholder for FFE1 marker followed by length (2 bytes)
      let newXmpDV = new DataView(xmpBytes.buffer);
      newXmpDV.setUint16(0, JPEG_APP1);
      newXmpDV.setUint16(2, xmpBytes.length - 2); // Exclude the marker bytes, but include the length bytes

      // Payload = preBytes + new XMP bytes + postBytes
//      let payloadLength = this.jpegPhoto.dataLength - this.jpegPhoto.xmpLength + newXmpDV.byteLength;
      let payloadLength = preBytes.length + xmpBytes.length + postBytes.length;
      let payload = new Uint8Array(payloadLength); 
      payload.set(preBytes, 0);
      payload.set(xmpBytes, jpegPhoto.xmpMarker);
      payload.set(postBytes, jpegPhoto.xmpMarker + newXmpDV.byteLength);

      return payload.buffer;
    }

    return null;

    function _updateXmpPacketDoc(xmpDoc, accounts, contexts) {


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
                  if (!contexts.hasOwnProperty(contextName) || (accounts[contextName].length === 0)) {
                    continue;
                  }

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

                  accounts[contextName].map((account) => {
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


  static _parseBuffer(buffer, contexts, readOnly) {


    let data = new DataView(buffer);
    let offset = 2;
    let jpegPhoto = {
      accounts: {},
      doc: null,
      sosMarker: null,
      dataLength: data.byteLength,
      xmpMarker: null,
      xmpLength: null
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
        jpegPhoto.sosMarker = start;
        break;
      } else if ((id === JPEG_APP1) && (jpegPhoto.doc === null)) {
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
            jpegPhoto.doc = new DOMParser().parseFromString(xmpText, "text/xml");

            // Parse XML and find all accounts in XMP packet
            jpegPhoto.accounts = _parseContextAccounts(jpegPhoto.doc, contexts);

            if (readOnly) {
              break;
            } else {
              // Strip all PhotoBlock references in anticipation of adding more accounts in future calls
              jpegPhoto.doc = _stripPhotoblockReferences(jpegPhoto.doc, contexts);
              jpegPhoto.xmpMarker = start;
              jpegPhoto.xmpLength = length + 4; // Add 2 bytes for length and 2 bytes for marker at start of packet

            }
            // If not readOnly continue while loop looking for JPEG_SOS marker
          }
        }
      }
      offset += length;
    }

    return jpegPhoto;


    function _parseContextAccounts(xmpdoc, contexts) {

      let accounts = {};
      for (let contextName in contexts) {
        if (!contexts.hasOwnProperty(contextName)) {
          continue;
        }
        accounts[contextName] = [];

        // Find photoblock:* elements which are the main wrapper
        let photoBlocks = xmpdoc.getElementsByTagName(NS_PHOTOBLOCK + ":" + contextName);
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
                contexts[contextName].attributes.map((attribute) => {
                  account[attribute] = null;
                });

                // Capture attributes that are defined for the context
                Array.prototype.forEach.call(item.attributes, (attribute) => {
                  // http://ns.photoblock.org/xmp/1.0/Ethereum#
                  if (attribute.namespaceURI === `${NS_IRI_PHOTOBLOCK}${contextName}#`) {
                    if (account.hasOwnProperty(attribute.localName)) {
                      account[attribute.localName] = attribute.value;
                    }
                  }
                });

                // Deduplication. The first attribute defined for a context is considered the key
                // attribute. If it already exists, we skip adding it to the accounts collection
                let keyAttribute = contexts[contextName].attributes[0];
                if (accounts[contextName].filter((a) => {
                    return a[keyAttribute] === account[keyAttribute]
                  }).length === 0) {
                    accounts[contextName].push(account);
                }
              }
            });
          });
        });

      };

      return accounts;
    }

    function _stripPhotoblockReferences(xmpdoc, contexts) {

      // Strip all namespace attributes from rdf:Description nodes
      let rdfDescriptions = xmpdoc.getElementsByTagName(TAG_RDF_DESCRIPTION);
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
        let photoBlocks = xmpdoc.getElementsByTagName(NS_PHOTOBLOCK + ":" + contextName);
        Array.prototype.forEach.call(photoBlocks, (photoBlock) => {
          photoBlock.parentNode.removeChild(photoBlock);
        });
      }

      return xmpdoc;
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
