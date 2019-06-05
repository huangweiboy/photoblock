
const params = new URLSearchParams(window.location.search);  
const session = params.get("session") || null;
const context = params.get("context") || null;

if (!session || !context) {
    window.location = 'index.html';
}

/*     BEGIN: PHOTOBLOCK INTEGRATION       */
let photoBlockContainerId = "photoblock-container";
let photoBlock = new PhotoBlock(photoBlockContainerId);
photoBlock.registerContext(EthereumContext);
photoBlock.registerContext(TronContext);
photoBlock.registerContext(KlaytnContext);
photoBlock.registerContext(WebContext);
photoBlock.registerContext(BitcoinContext);

photoBlock.on(PhotoBlock.eventTypes().CREATE, () => console.log('PhotoBlock was created'));
photoBlock.on(PhotoBlock.eventTypes().HIDE, () => console.log('PhotoBlock modal was hidden'));
photoBlock.on(PhotoBlock.eventTypes().LOAD, () => console.log('PhotoBlock photo was loaded'));
photoBlock.on(PhotoBlock.eventTypes().LOCK, () => console.log('PhotoBlock was locked'));
photoBlock.on(PhotoBlock.eventTypes().NEW, () => console.log('New photo was loaded'));
photoBlock.on(PhotoBlock.eventTypes().SHOW, () => console.log('PhotoBlock modal was displayed'));
photoBlock.on(PhotoBlock.eventTypes().UNLOCK, (account) => {
    console.log('PhotoBlock was unlocked', account);
});

/*    render() method is called each time demo context changes in updateContexts()      */
/*    END: PHOTOBLOCK INTEGRATION     */


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


