"use strict";

import DOM from './core/dom.js';
import Component from './core/component';
import store from './store/index';
import FileSaver from "file-saver";
import PhotoBlockModal from "./components/modal";
import PhotoBlockBtn from "./img/photoblock-btn.png";
import PhotoBlockXmp from "./components/xmp";
import GridTemplate from "./templates/grid.html";
import "./css/photoblock.css";


export default class PhotoBlock extends Component {

  constructor(containerId) {

    super({
      store,
      element: document.querySelector(`#${containerId}`)
    })

    this.containerId = containerId;
  }

  render() {
    let self = this;
    self.log('photoblock..render');
    
    let className = 'photoblock-button';
    self.element.innerHTML = '';
    self.element.appendChild(DOM.img({ className: className, src: PhotoBlockBtn, alt: "PhotoBlock" }));  
    if (!store.state.modal) {
      store.state.modal = new PhotoBlockModal();
    }
    self.element.querySelector(`.${className}`).addEventListener("click", (e) => {
      store.dispatch('showModal', {});

      //store.state.modal.render();
      // PhotoBlock.modal = new PhotoBlockModal(function(event, data) {

      //   switch(event) {
      //     case "FILE_UPLOAD":
      //       self.processFileUpload(data);
      //       break;
      //   }
      // })

      // PhotoBlock.modal.launch();
    }); 
  }

  _update() {
    let self = this;
    self.log('photoblock.._update');

    if (store.state.started === true) {
      self.log('photoblock.._init..click');
      
      self.modal.render();
    }
  }

  processFileUpload(data) {

    // Display the photo
    PhotoBlock.modal.content.insertAdjacentHTML("beforeend", GridTemplate);
    let photo = document.getElementById("photoblock-photo");
    photo.src = data.imgData;

    // Parse photo for PhotoBlock
    let photoblockXmp = new PhotoBlockXmp();
    photoblockXmp.parsePhoto(data.buffer);
    // console.log(jpegXmp.getPhotoContext("Ethereum"));
    // console.log(jpegXmp.getPhotoContext("Bitcoin"));
    // console.log(jpegXmp.getPhotoContext("Litecoin"));
    console.log(photoblockXmp.getPhotoContexts());
    //let result = jpegXmp.addPhotoAccount(buffer, "Bitcoin", { address: "510101010101010101", publicKey: "xxxxxxxxxxxxxxxxxxxxxxx"});
    // let blob = photoblockXmp.addPhotoAccount(data.buffer, "Ethereum", {
    //     address: "Happy Birthday Mummy",
    //     publicKey: "xxxxxxxxxxxxxxxxxxxxxxx"
    // });
    // if (blob !== null) {
    //     FileSaver.saveAs(blob, "PhotoBlock.jpg");
    // }
  }


}
