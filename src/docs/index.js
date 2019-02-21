import PhotoBlock from "../lib/index";
import "./styles.css";

let photoBlockContainerId = "photoblock-container";
let photoBlock = new PhotoBlock(photoBlockContainerId);

let contexts = photoBlock.getContextNames();
updateContexts(contexts);    
photoBlock.render(contexts[0]);



function updateContexts(contexts) {
    let select = document.getElementById("context-switch");
    select.innerHTML = '';
    contexts.map((key) => {
        let option = document.createElement('option');
        option.innerText = key;
        select.appendChild(option);
    })
    select.addEventListener('change', (e) => {
        photoBlock.render(e.target.value);
    })
}
   
