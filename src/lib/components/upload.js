"use strict";
import UploadTemplate from "../templates/upload.html";

export default class PhotoBlockUpload {
    constructor(callback, content) {
        this.dropArea = null;
        this.dropFiles = null;
        this.callback = callback;
        this.content = content;console.log(this.content);
    }

    render() {

        let self = this;
        self.content.insertAdjacentHTML("beforeend", UploadTemplate);

        this.dropFiles = document.getElementById("photoblock-files");
        this.dropArea = document.getElementById("photoblock-drop-area");
        this.dropFiles.onchange = (evt) => {
            self.handleFiles(evt.target.files);
        }

        // Prevent default drag behaviors
        ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
            self.dropArea.addEventListener(eventName, function(e) { self.preventDefaults(e); }, false);
            document.body.addEventListener(eventName, self.preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ["dragenter", "dragover"].forEach(eventName => {
            self.dropArea.addEventListener(eventName, function() { self.highlight(); }, false);
        });

        ["dragleave", "drop"].forEach(eventName => {
            self.dropArea.addEventListener(eventName, function() { self.unhighlight(); }, false);
        });

        // Handle dropped files
        self.dropArea.addEventListener("drop", function(e) { self.handleDrop(e); }, false);

    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight() {
        this.dropArea.classList.add("photoblock-drop-area-highlight");
    }

    unhighlight() {
        this.dropArea.classList.remove("photoblock-drop-area-highlight");
    }

    handleDrop(e) {
        this.unhighlight();
        let dt = e.dataTransfer;
        let files = dt.files;
        this.handleFiles(files);
    }

    handleFiles(files) {
        let uploads = [...files];
        if (uploads.length > 0) {

            // Only first file is processed
            this.processFile(uploads[0]);
        }
    }

    processFile(file) {
        let self = this;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (event) {
            let dataURI = event.target.result;

            // Use fetch API to convert dataURI to ArrayBuffer
            fetch(dataURI)
                .then((res) => res.arrayBuffer())
                .then((buffer) => {
                    while (self.content.firstChild) {
                        self.content.removeChild(self.content.firstChild);
                    }
                    // Get XMP
                    self.callback("FILE_UPLOAD", {  imgData: dataURI, buffer: buffer } );
                });

        }


    }




}
