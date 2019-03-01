import PhotoBlock from "../lib/index";
import "./styles.css";
import s01 from './img/screens/01@2x.png';
import s02 from './img/screens/02@2x.png';
import s03 from './img/screens/03@2x.png';
import s04 from './img/screens/04@2x.png';
import s05 from './img/screens/05@2x.png';
import s06 from './img/screens/06@2x.png';
import s07 from './img/screens/07@2x.png';
import s08 from './img/screens/08@2x.png';
import s09 from './img/screens/09@2x.png';
import s10 from './img/screens/10@2x.png';
import s11 from './img/screens/11@2x.png';
import s12 from './img/screens/12@2x.png';
import s13 from './img/screens/13@2x.png';
import s14 from './img/screens/14@2x.png';


/*     BEGIN: PHOTOBLOCK INTEGRATION       */
let photoBlockContainerId = "photoblock-container";
let photoBlock = new PhotoBlock(photoBlockContainerId);
photoBlock.on(PhotoBlock.eventTypes().CREATE, () => console.log('PhotoBlock was created'));
photoBlock.on(PhotoBlock.eventTypes().HIDE, () => console.log('PhotoBlock modal was hidden'));
photoBlock.on(PhotoBlock.eventTypes().LOAD, () => console.log('PhotoBlock photo was loaded'));
photoBlock.on(PhotoBlock.eventTypes().LOCK, () => console.log('PhotoBlock was locked'));
photoBlock.on(PhotoBlock.eventTypes().NEW, () => console.log('New photo was loaded'));
photoBlock.on(PhotoBlock.eventTypes().SHOW, () => console.log('PhotoBlock modal was displayed'));
photoBlock.on(PhotoBlock.eventTypes().UNLOCK, (account) => {
    console.log('PhotoBlock was unlocked', account);
    window.clearInterval(iconShakeHandle);
});

/*    render() method is called each time demo context changes in updateContexts()      */
/*    END: PHOTOBLOCK INTEGRATION     */


let iconShakeHandle = window.setInterval(() => {
    let pc = document.getElementById('photoblock-container');
    if (pc.className === 'animated') {
        pc.className = '';
    } else {
        pc.className = 'animated';
    }
}, 4000)


let screens = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14];
let currentScreen = 0;

window.setInterval(() => {
    currentScreen++;
    if (currentScreen == screens.length) {
        currentScreen = 0;
    }
    document.getElementById('photoblock-screen').src = screens[currentScreen];
}, 2000);

function updateContexts(contexts, callback) {
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
    callback();
}
   
let select = document.getElementById("context-switch");
let contexts = photoBlock.getContextNames();
updateContexts(contexts, () => {
    select.value = 'Ethereum';
    select.dispatchEvent(new Event('change'));    
});    


