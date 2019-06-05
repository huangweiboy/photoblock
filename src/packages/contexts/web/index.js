import nacl from 'tweetnacl/nacl-fast';
import logo from './web.png';
import Phonetic from './phonetic';

export default class WebContext {

    static ADJECTIVES = ["abundant","acceptable","accessible","accurate","acoustic","adamant","adaptable","adorable","adventurous","agreeable","alike","alive","amazing","ambiguous","ambitious","amiable","amused","amusing","animated","aquatic","aspiring","assorted","astonishing","attractive","auspicious","automatic","available","average","awake","aware","awesome","axiomatic","beautiful","befitting","beneficial","bent","berserk","'best","better","bewildered","big","bizarre","blushing","bouncy","boundless","brainy","brave","bright","bubbly","calm","capable","careful","caring","certain","changeable","charming","cheerful","chief","chivalrous","classy","clean","clear","clever","colorful","comfortable","common","compassionate","considerate","convivial","cool","cooperative","coordinated","courageous","courteous","cuddly","cultured","curious","curly","curved","curvy","cute","dashing","dazzling","decisive","delicate","delicious","delightful","determined","diligent","educated","efficacious","efficient","elated","electric","elegant","empathetic","enchanting","encouraging","energetic","entertaining","enthusiastic","ethereal","excellent","excited","exciting","exotic","fabulous","fair","faithful","familiar","famous","fanatical","fancy","fantastic","fascinated","fearless","festive","fierce","flawless","flowery","fluffy","fluttering","fortunate","fresh","friendly","funny","furry","generous","gentle","glamorous","gleaming","glorious","glossy","gorgeous","graceful","grateful","groovy","handsome","happy","harmonious","healthy","heavenly","helpful","hilarious","honorable","humorous","imaginary","inquisitive","intelligent","interesting","invincible","jolly","joyous","judicious","juicy","kind","kindhearted","knowledgeable","likable","lovely","loving","lyrical","magical","magnificent","majestic","marvelous","mellow","melodic","mighty","momentous","nice","nifty","nimble","nostalgic","nutritious","observant","odd","optimal","ordinary","organic","outgoing","outstanding","overjoyed","peaceful","perfect","periodic","permissible","pleasant","poised","polite","powerful","precious","premium","pretty","productive","quirky","reflective","regular","reliable","relieved","remarkable","responsible","rhetorical","right","righteous","romantic","royal","sassy","satisfying","shy","silly","simplistic","sincere","skillful","smart","smiling","smooth","sneaky","sophisticated","sparkling","special","spectacular","spiritual","successful","succinct","supreme","swanky","sweet","sympathetic","talented","tasteful","terrific","thankful","thoughtful","tidy","tremendous","truthful","unique","upbeat","uppity","victorious","vivacious","wacky","whimsical","whispering","wiggly","wild","willing","witty","wonderful","yummy","zany","zealous","zesty","zippy","zonked"];

    //["agreeable", "alert", "alluring", "ambitious", "amused", "boundless", "brave", "bright", "calm", "capable", "charming", "cheerful", "coherent", "comfortable", "confident", "cooperative", "courageous", "credible", "cultured", "dashing", "dazzling", "debonair", "decisive", "decorous", "delightful", "detailed", "determined", "diligent", "discreet", "dynamic", "eager", "efficient", "elated", "eminent", "enchanting", "encouraging", "endurable", "energetic", "entertaining", "enthusiastic", "excellent", "excited", "exclusive", "exuberant", "fabulous", "fair", "faithful", "fantastic", "fearless", "fine", "frank", "friendly", "funny", "generous", "gentle", "glorious", "good", "happy", "harmonious", "helpful", "hilarious", "honorable", "impartial", "industrious", "instinctive", "jolly", "joyous", "kind", "kind-hearted", "knowledgeable", "level", "likeable", "lively", "lovely", "loving", "lucky", "mature", "modern", "nice", "obedient", "painstaking", "peaceful", "perfect", "placid", "plausible", "pleasant", "plucky", "productive", "protective", "proud", "punctual", "quiet", "receptive", "reflective", "relieved", "resolute", "responsible", "rhetorical", "righteous", "romantic", "sedate", "seemly", "selective", "self-assured", "sensitive", "shrewd", "silly", "sincere", "skillful", "smiling", "splendid", "steadfast", "stimulating", "successful", "succinct", "talented", "thoughtful", "thrifty", "tough", "trustworthy", "unbiased", "unusual", "upbeat", "vigorous", "vivacious", "warm", "willing", "wise", "witty", "wonderful"];

    static Name = 'Web';
    static Symbol = 'WWW';
    static LogoUrl = logo;
    static Count = 5;
    static HdPath = 'm/255\'/255\'/255\'/255';
    static Attributes = ['userId', 'displayName', '\'publicKey']; 
    static Handlers = {
        'generateAccounts': WebContext.generateAccounts,
        'sign': WebContext.sign
    }

    static generateAccounts(accountSeed) {
        let adjectives = [];
        for(let adj=0; adj < accountSeed.count; adj++) {
            adjectives.push(WebContext.ADJECTIVES[accountSeed.entropy[adj]]);
        }

        let accounts = [];
        for (let c = 0; c < accountSeed.count; c++) {
            let hash = new Uint8Array(accountSeed.entropy);
            hash[c] = c;
            let keyPair = nacl.box.keyPair.fromSecretKey(hash);

            let name = Phonetic.generate({
                seed: hash
            });
    
            accounts.push({
                userId: `${adjectives[c]}-${name}`,
                displayName: `${adjectives[c].substr(0,1).toUpperCase()}${adjectives[c].substr(1)} ${name.substr(0,1).toUpperCase()}${name.substr(1)}`,
                publicKey: WebContext.arr2hex(keyPair.publicKey)
            });
        }
        return accounts;
    }

    static sign(data, reason, callback) {}

    static arr2hex(arr) {
        return Array.prototype.map.call(arr, x => ('00' + x.toString(16)).slice(-2)).join('');
    }

}