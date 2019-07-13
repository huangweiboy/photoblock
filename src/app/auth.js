
const params = new URLSearchParams(window.location.search);  
const session = params.get("session") || null;
const context = params.get("context") || null;

if (!session || !context) {
    window.location = document.referrer;
}

/*     BEGIN: PHOTOBLOCK INTEGRATION       */
let photoBlock = new PhotoBlockAuth();
photoBlock.registerContext(KlaytnContext);
photoBlock.registerContext(BitcoinContext);

photoBlock.on(PhotoBlockAuth.eventTypes().CREATE, () => console.log('PhotoBlock was created'));
photoBlock.on(PhotoBlockAuth.eventTypes().HIDE, () => console.log('PhotoBlock modal was hidden'));
photoBlock.on(PhotoBlockAuth.eventTypes().LOAD, () => console.log('PhotoBlock photo was loaded'));
photoBlock.on(PhotoBlockAuth.eventTypes().LOCK, () => console.log('PhotoBlock was locked'));
photoBlock.on(PhotoBlockAuth.eventTypes().NEW, () => console.log('New photo was loaded'));
photoBlock.on(PhotoBlockAuth.eventTypes().SHOW, () => console.log('PhotoBlock modal was displayed'));
photoBlock.on(PhotoBlockAuth.eventTypes().UNLOCK, (account) => {
    console.log('PhotoBlock was unlocked', account);
});

photoBlock.render(context, () => {} );
/*    render() method is called each time demo context changes in updateContexts()      */
/*    END: PHOTOBLOCK INTEGRATION     */

