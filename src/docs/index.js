import PhotoBlock from "../lib/index";
import "./styles.css";
//const Jimp = require("jimp/dist")

let photoBlockContainerId = "photoblock-container";
let photoBlock = new PhotoBlock(photoBlockContainerId, (instance) => {
    updateContexts(instance.contexts);    
    instance.render(Object.keys(instance.contexts)[0]);
});


function updateContexts(contexts) {
    let select = document.getElementById("context-switch");
    select.innerHTML = '';
    Object.keys(contexts).map((key) => {
        let option = document.createElement('option');
        option.innerText = key;
        select.appendChild(option);
    })
    select.addEventListener('change', (e) => {
        photoBlock.render(e.target.value);
    })
}
   
