import enUS from '../lang/en-US';

class Localizer {
    
    constructor() {

        if (!Localizer.instance) {
            Localizer.instance = this;

            let supportedLocales = {
                'en-us': enUS
            }
    
            if (supportedLocales[navigator.language.toLowerCase()]) {
                this.lang = supportedLocales[navigator.language.toLowerCase()];
            } else {
                this.lang = supportedLocales['en-us'];
            }
    
            this.generateRandomItems(this.lang);
            this.context = null;
        }

        return Localizer.instance;
    }

    setContext(context) {
        let tokens = ['name'];
        for(let parentKey in this.lang) {
            for(let childKey in this.lang[parentKey]) {
                // Replace context references in lang **values**
                if (typeof this.lang[parentKey][childKey] === 'string') {
                    tokens.map((token) => {
                        this.lang[parentKey][childKey] = this.lang[parentKey][childKey].split(`[context.${token}]`).join(context[token]);
                    });    
                }
            }
        }
        this.lang.context = {
            name: context.name
        };
    }

    generateRandomItems(items) {
        // Get one item at random from the values and add a key at the same level
        // with the suffix 'Random'...used for rotating different values from a set

        let self = this;
        let keys = Object.keys(items);
        keys.map((key) => {
            if (Array.isArray(items[key])) {
                let any = items[key][Math.floor(Math.random()*items[key].length)];
                items[key + 'Random'] = any;
            } else if (typeof items[key] === 'object') {
                self.generateRandomItems(items[key]);
            }
        });
    }

    get(key) {
        return this.lang[key];
    }

    localize(template) {
        return new Function("return `" + template.replace(/{/g, "{this.") + "`;").call(this.lang);
    }
}

const instance = new Localizer();

export default instance;

