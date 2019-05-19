import nacl from 'tweetnacl/nacl-fast';
import logo from './web.png';

export default class WebContext {

    static ADJECTIVES = ["agreeable", "alert", "alluring", "ambitious", "amused", "boundless", "brave", "bright", "calm", "capable", "charming", "cheerful", "coherent", "comfortable", "confident", "cooperative", "courageous", "credible", "cultured", "dashing", "dazzling", "debonair", "decisive", "decorous", "delightful", "detailed", "determined", "diligent", "discreet", "dynamic", "eager", "efficient", "elated", "eminent", "enchanting", "encouraging", "endurable", "energetic", "entertaining", "enthusiastic", "excellent", "excited", "exclusive", "exuberant", "fabulous", "fair", "faithful", "fantastic", "fearless", "fine", "frank", "friendly", "funny", "generous", "gentle", "glorious", "good", "happy", "harmonious", "helpful", "hilarious", "honorable", "impartial", "industrious", "instinctive", "jolly", "joyous", "kind", "kind-hearted", "knowledgeable", "level", "likeable", "lively", "lovely", "loving", "lucky", "mature", "modern", "nice", "obedient", "painstaking", "peaceful", "perfect", "placid", "plausible", "pleasant", "plucky", "productive", "protective", "proud", "punctual", "quiet", "receptive", "reflective", "relieved", "resolute", "responsible", "rhetorical", "righteous", "romantic", "sedate", "seemly", "selective", "self-assured", "sensitive", "shrewd", "silly", "sincere", "skillful", "smiling", "splendid", "steadfast", "stimulating", "successful", "succinct", "talented", "thoughtful", "thrifty", "tough", "trustworthy", "unbiased", "unusual", "upbeat", "vigorous", "vivacious", "warm", "willing", "wise", "witty", "wonderful"];
    static ANIMALS = ["aardvark", "albatross", "alligator", "alpaca", "ant", "anteater", "antelope", "ape", "armadillo", "baboon", "badger", "barracuda", "bat", "bear", "beaver", "bee", "bison", "boar", "buffalo", "butterfly", "camel", "capybara", "caribou", "cat", "caterpillar", "cattle", "cheetah", "chicken", "chimpanzee", "chinchilla", "clam", "cobra", "cockroach", "cod", "coyote", "crab", "crane", "crocodile", "crow", "deer", "dinosaur", "dog", "dolphin", "donkey", "dove", "dragonfly", "duck", "eagle", "eel", "elephant", "elk", "emu", "falcon", "ferret", "finch", "fish", "flamingo", "fly", "fox", "frog", "gazelle", "gerbil", "giraffe", "gnat", "gnu", "goat", "goose", "goldfinch", "goldfish", "gorilla", "grasshopper", "gull", "hamster", "hare", "hawk", "hedgehog", "heron", "herring", "hippopotamus", "hornet", "horse", "human", "hummingbird", "hyena", "ibex", "jackal", "jaguar", "jay", "jellyfish", "kangaroo", "kingfisher", "koala", "kookabura", "lark", "lemur", "leopard", "lion", "llama", "lobster", "locust", "magpie", "mallard", "manatee", "mandrill", "mantis", "marten", "meerkat", "mink", "mole", "mongoose", "monkey", "moose", "mouse", "mosquito", "mule", "narwhal", "newt", "nightingale", "octopus", "opossum", "ostrich", "otter", "owl", "ox", "oyster", "panda", "panther", "parrot", "partridge", "pelican", "penguin", "pheasant", "pig", "pigeon", "pony", "porcupine", "porpoise", "quail", "rabbit", "raccoon", "rail", "ram", "rat", "raven", "reindeer", "rhinoceros", "salamander", "salmon", "sandpiper", "sardine", "scorpion", "sealion", "seahorse", "seal", "shark", "sheep", "skunk", "snail", "snake", "sparrow", "spider", "squid", "squirrel", "stingray", "stinkbug", "stork", "swallow", "swan", "tapir", "termite", "tiger", "toad", "trout", "turkey", "turtle", "viper", "vulture", "wallaby", "walrus", "wasp", "weasel", "whale", "wolf", "wolverine", "wombat", "woodpecker", "worm", "wren", "yak", "zebra"];
    static Name = 'Web';
    static Symbol = 'WWW';
    static LogoUrl = logo;
    static Count = 1;
    static HdPath = 'm/255\'/255\'/255\'/255';
    static Attributes = ['name', 'userId', '\'publicKey'];
    static Handlers = {
        'generateAccounts': WebContext.generateAccounts,
        'sign': WebContext.sign
    }

    static generateAccounts(accountSeed) {
        console.log('Web', accountSeed);
        let hashArray = WebContext.arrayify(accountSeed.entropy);


        let adjectives = [];
        for(let adj=0; adj < accountSeed.count; adj++) {
            let idx = hashArray[adj];
            if (idx <= (WebContext.ADJECTIVES.length - 1)) {
                adjectives.push(WebContext.ADJECTIVES[idx]);
            }
        }

        let animals = [];
        for(let ani=0; ani < accountSeed.count; ani++) {
            let idx = hashArray[hashArray.length - 1 - ani];
            if (idx <= (WebContext.ANIMALS.length - 1)) {
                animals.push(WebContext.ANIMALS[idx]);
            }
        }

        let accounts = [];
        for (let c = 0; c < accountSeed.count; c++) {
            let hash = new Uint8Array(accountSeed.entropy);
            hash[c] = c;
            let keyPair = nacl.box.keyPair.fromSecretKey(hash);
           
            accounts.push({
                name: `${adjectives[c]}-${animals[c]}`,
                userId: 'ABCD',
                publicKey: WebContext.arr2hex(keyPair.publicKey)
            });
        }

        return accounts;
    }

    static sign(data, reason, callback) {}

    static arr2hex(arr) {
        return Array.prototype.map.call(arr, x => ('00' + x.toString(16)).slice(-2)).join('');
    }
    // https://github.com/ethers-io/ethers.js/
    static arrayify(value) {
        if (value == null) {
            errors.throwError('cannot convert null value to array', errors.INVALID_ARGUMENT, {
                arg: 'value',
                value: value
            });
        }
        if (WebContext.isHexable(value)) {
            value = value.toHexString();
        }
        if (typeof (value) === 'string') {
            var match = value.match(/^(0x)?[0-9a-fA-F]*$/);
            if (!match) {
                errors.throwError('invalid hexidecimal string', errors.INVALID_ARGUMENT, {
                    arg: 'value',
                    value: value
                });
            }
            if (match[1] !== '0x') {
                errors.throwError('hex string must have 0x prefix', errors.INVALID_ARGUMENT, {
                    arg: 'value',
                    value: value
                });
            }
            value = value.substring(2);
            if (value.length % 2) {
                value = '0' + value;
            }
            var result = [];
            for (var i = 0; i < value.length; i += 2) {
                result.push(parseInt(value.substr(i, 2), 16));
            }
            return WebContext.addSlice(new Uint8Array(result));
        }
        if (WebContext.isArrayish(value)) {
            return WebContext.addSlice(new Uint8Array(value));
        }
        errors.throwError('invalid arrayify value', null, {
            arg: 'value',
            value: value,
            type: typeof (value)
        });
        return null;
    }

    static addSlice(array) {
        if (array.slice) {
            return array;
        }
        array.slice = function () {
            var args = Array.prototype.slice.call(arguments);
            return WebContext.addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
        };
        return array;
    }
    static isArrayish(value) {
        if (!value || parseInt(String(value.length)) != value.length || typeof (value) === 'string') {
            return false;
        }
        for (var i = 0; i < value.length; i++) {
            var v = value[i];
            if (v < 0 || v >= 256 || parseInt(String(v)) != v) {
                return false;
            }
        }
        return true;
    }

    static isHexable(value) {
        return !!(value.toHexString);
    }
}