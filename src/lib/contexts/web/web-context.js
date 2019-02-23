import { ethers } from 'ethers';

export default class WebContext {

    static  ADJECTIVES = ["agreeable", "alert", "alluring", "ambitious", "amused", "boundless", "brave", "bright", "calm", "capable", "charming", "cheerful", "coherent", "comfortable", "confident", "cooperative", "courageous", "credible", "cultured", "dashing", "dazzling", "debonair", "decisive", "decorous", "delightful", "detailed", "determined", "diligent", "discreet", "dynamic", "eager", "efficient", "elated", "eminent", "enchanting", "encouraging", "endurable", "energetic", "entertaining", "enthusiastic", "excellent", "excited", "exclusive", "exuberant", "fabulous", "fair", "faithful", "fantastic", "fearless", "fine", "frank", "friendly", "funny", "generous", "gentle", "glorious", "good", "happy", "harmonious", "helpful", "hilarious", "honorable", "impartial", "industrious", "instinctive", "jolly", "joyous", "kind", "kind-hearted", "knowledgeable", "level", "likeable", "lively", "lovely", "loving", "lucky", "mature", "modern", "nice", "obedient", "painstaking", "peaceful", "perfect", "placid", "plausible", "pleasant", "plucky", "productive", "protective", "proud", "punctual", "quiet", "receptive", "reflective", "relieved", "resolute", "responsible", "rhetorical", "righteous", "romantic", "sedate", "seemly", "selective", "self-assured", "sensitive", "shrewd", "silly", "sincere", "skillful", "smiling", "splendid", "steadfast", "stimulating", "successful", "succinct", "talented", "thoughtful", "thrifty", "tough", "trustworthy", "unbiased", "unusual", "upbeat", "vigorous", "vivacious", "warm", "willing", "wise", "witty", "wonderful"];
    static ANIMALS = ["aardvark", "albatross", "alligator", "alpaca", "ant", "anteater", "antelope", "ape", "armadillo", "baboon", "badger", "barracuda", "bat", "bear", "beaver", "bee", "bison", "boar", "buffalo", "butterfly", "camel", "capybara", "caribou", "cat", "caterpillar", "cattle", "cheetah", "chicken", "chimpanzee", "chinchilla", "clam", "cobra", "cockroach", "cod", "coyote", "crab", "crane", "crocodile", "crow", "deer", "dinosaur", "dog", "dolphin", "donkey", "dove", "dragonfly", "duck", "eagle", "eel", "elephant", "elk", "emu", "falcon", "ferret", "finch", "fish", "flamingo", "fly", "fox", "frog", "gazelle", "gerbil", "giraffe", "gnat", "gnu", "goat", "goose", "goldfinch", "goldfish", "gorilla", "grasshopper", "gull", "hamster", "hare", "hawk", "hedgehog", "heron", "herring", "hippopotamus", "hornet", "horse", "human", "hummingbird", "hyena", "ibex", "jackal", "jaguar", "jay", "jellyfish", "kangaroo", "kingfisher", "koala", "kookabura", "lark", "lemur", "leopard", "lion", "llama", "lobster", "locust", "magpie", "mallard", "manatee", "mandrill", "mantis", "marten", "meerkat", "mink", "mole", "mongoose", "monkey", "moose", "mouse", "mosquito", "mule", "narwhal", "newt", "nightingale", "octopus", "opossum", "ostrich", "otter", "owl", "ox", "oyster", "panda", "panther", "parrot", "partridge", "pelican", "penguin", "pheasant", "pig", "pigeon", "pony", "porcupine", "porpoise", "quail", "rabbit", "raccoon", "rail", "ram", "rat", "raven", "reindeer", "rhinoceros", "salamander", "salmon", "sandpiper", "sardine", "scorpion", "sealion", "seahorse", "seal", "shark", "sheep", "skunk", "snail", "snake", "sparrow", "spider", "squid", "squirrel", "stingray", "stinkbug", "stork", "swallow", "swan", "tapir", "termite", "tiger", "toad", "trout", "turkey", "turtle", "viper", "vulture", "wallaby", "walrus", "wasp", "weasel", "whale", "wolf", "wolverine", "wombat", "woodpecker", "worm", "wren", "yak", "zebra"];

    static createAccount(hdInfo) {

        let hashArray = ethers.utils.arrayify(hdInfo.hash);
        let idx1 = hashArray[0];
        let idx2 = hashArray[hashArray.length-1];
        let counter = 0;
        while((idx1 > (WebContext.ADJECTIVES.length - 1)) || (idx2 > (WebContext.ANIMALS.length -1))) {
            counter++;
            if (idx1 > (WebContext.ADJECTIVES.length - 1)) {
                idx1 = hashArray[counter];
            }
            if (idx2 > (WebContext.ANIMALS.length - 1)) {
                idx2 = hashArray[hashArray.length-1-counter];
            }

            if (counter === (hashArray.length - 2)) {
                if (idx1 > (WebContext.ADJECTIVES.length - 1)) {
                    idx1 = Math.floor(Math.random() * WebContext.ADJECTIVES.length);
                }
                if (idx2 > (WebContext.ANIMALS.length - 1)) {
                    idx2 = Math.floor(Math.random() * WebContext.ANIMALS.length);
                }
            }
        }

        let wallet = ethers.Wallet.fromMnemonic(ethers.utils.HDNode.entropyToMnemonic(hdInfo.hash),`${hdInfo.path}/${hdInfo.index}`);
        let accountInfo = { username: `${WebContext.ADJECTIVES[idx1]}-${WebContext.ANIMALS[idx2]}`, userId: wallet.address.replace('0x',''), publicKey: wallet.signingKey.publicKey };
        hdInfo = null;
        wallet = null;

        return accountInfo;
    }
}