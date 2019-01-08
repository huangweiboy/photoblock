import enUS from '../lang/en-US';
import esES from '../lang/es-ES';

export default class Localizer {
    constructor() {
        let supportedLocales = {
            'en-us': enUS,
            'es-es': esES
        }

        if (supportedLocales[navigator.language.toLowerCase()]) {
            this.lang = supportedLocales[navigator.language.toLowerCase()];
        } else {
            this.lang = supportedLocales['en-us'];
        }
    }

    localize(template) {
        return new Function("return `" + template.replace(/{/g, "{this.") + "`;").call(this.lang);
    }
}