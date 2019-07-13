
/*     BEGIN: PHOTOBLOCK INTEGRATION       */
let photoBlockContainerId = "photoblock-container";
let photoBlock = new PhotoBlockClient(photoBlockContainerId, { horizontal: true });

photoBlock.registerContext(BitcoinContext);

photoBlock.on(PhotoBlockClient.eventTypes().CREATE, () => console.log('PhotoBlock was created'));
photoBlock.on(PhotoBlockClient.eventTypes().HIDE, () => console.log('PhotoBlock modal was hidden'));
photoBlock.on(PhotoBlockClient.eventTypes().LOAD, () => console.log('PhotoBlock photo was loaded'));
photoBlock.on(PhotoBlockClient.eventTypes().LOCK, () => console.log('PhotoBlock was locked'));
photoBlock.on(PhotoBlockClient.eventTypes().NEW, () => console.log('New photo was loaded'));
photoBlock.on(PhotoBlockClient.eventTypes().SHOW, () => console.log('PhotoBlock modal was displayed'));
photoBlock.on(PhotoBlockClient.eventTypes().UNLOCK, (account) => {
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


