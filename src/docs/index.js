import PhotoBlock from "../lib/index";
import "./styles.css";
import photoblockEmoji from "../lib/components/emoji/11/photoblock-emoji";

let photoBlockContainerId = "photoblock-container";
let photoBlock = new PhotoBlock(photoBlockContainerId);

let contexts = photoBlock.getContextNames();
updateContexts(contexts);    

photoBlock.on(PhotoBlock.eventTypes().CREATE, () => console.log('PhotoBlock was created'));
photoBlock.on(PhotoBlock.eventTypes().HIDE, () => console.log('PhotoBlock modal was hidden'));
photoBlock.on(PhotoBlock.eventTypes().LOAD, () => console.log('PhotoBlock photo was loaded'));
photoBlock.on(PhotoBlock.eventTypes().LOCK, () => console.log('PhotoBlock was locked'));
photoBlock.on(PhotoBlock.eventTypes().NEW, () => console.log('New photo was loaded'));
photoBlock.on(PhotoBlock.eventTypes().SHOW, () => console.log('PhotoBlock modal was displayed'));
photoBlock.on(PhotoBlock.eventTypes().UNLOCK, () => console.log('PhotoBlock was unlocked'));

photoBlock.render(contexts[0], () => {
    console.log('PhotoBlock is ready');
});



function updateContexts(contexts) {
    let select = document.getElementById("context-switch");
    select.innerHTML = '';
    contexts.map((key) => {
        let option = document.createElement('option');
        option.innerText = key;
        select.appendChild(option);
    })
    select.addEventListener('change', (e) => {
        photoBlock.render(e.target.value, () => {
            console.log('PhotoBlock is ready');
        });
    })
}
   
