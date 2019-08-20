
let params = new URLSearchParams(window.location.search);  
let session = params.get("session") || null;
let context = params.get("context") || null;

if (!session) {
    session = '1';
}

if (!context) {
    context = 'Ethereum';
}

/*     BEGIN: PHOTOBLOCK INTEGRATION       */
let photoBlock = new PhotoBlockAuth();
photoBlock.registerContext(KlaytnContext);
photoBlock.registerContext(NearContext);
photoBlock.registerContext(HarmonyContext);
photoBlock.registerContext(BitcoinContext);

photoBlock.on(PhotoBlockAuth.eventTypes().CREATE, () => console.log('PhotoBlock was created'));
photoBlock.on(PhotoBlockAuth.eventTypes().HIDE, () => location.href = '/');
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

