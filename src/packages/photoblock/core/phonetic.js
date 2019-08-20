/*
 * Phonetic
 * Copyright 2013-2016 Tom Shawver
 * https://github.com/TomFrost/node-phonetic
 */

import blake from 'blakejs';

export default class Phonetic {

	static ADJECTIVES = ["abundant","acceptable","accessible","accurate","acoustic","adamant","adaptable","adorable","adventurous","agreeable","alike","alive","amazing","ambiguous","ambitious","amiable","amused","amusing","animated","aquatic","aspiring","assorted","astonishing","attractive","auspicious","automatic","available","average","awake","aware","awesome","axiomatic","beautiful","befitting","beneficial","bent","berserk","'best","better","bewildered","big","bizarre","blushing","bouncy","boundless","brainy","brave","bright","bubbly","calm","capable","careful","caring","certain","changeable","charming","cheerful","chief","chivalrous","classy","clean","clear","clever","colorful","comfortable","common","compassionate","considerate","convivial","cool","cooperative","coordinated","courageous","courteous","cuddly","cultured","curious","curly","curved","curvy","cute","dashing","dazzling","decisive","delicate","delicious","delightful","determined","diligent","educated","efficacious","efficient","elated","electric","elegant","empathetic","enchanting","encouraging","energetic","entertaining","enthusiastic","ethereal","excellent","excited","exciting","exotic","fabulous","fair","faithful","familiar","famous","fanatical","fancy","fantastic","fascinated","fearless","festive","fierce","flawless","flowery","fluffy","fluttering","fortunate","fresh","friendly","funny","furry","generous","gentle","glamorous","gleaming","glorious","glossy","gorgeous","graceful","grateful","groovy","handsome","happy","harmonious","healthy","heavenly","helpful","hilarious","honorable","humorous","imaginary","inquisitive","intelligent","interesting","invincible","jolly","joyous","judicious","juicy","kind","kindhearted","knowledgeable","likable","lovely","loving","lyrical","magical","magnificent","majestic","marvelous","mellow","melodic","mighty","momentous","nice","nifty","nimble","nostalgic","nutritious","observant","odd","optimal","ordinary","organic","outgoing","outstanding","overjoyed","peaceful","perfect","periodic","permissible","pleasant","poised","polite","powerful","precious","premium","pretty","productive","quirky","reflective","regular","reliable","relieved","remarkable","responsible","rhetorical","right","righteous","romantic","royal","sassy","satisfying","shy","silly","simplistic","sincere","skillful","smart","smiling","smooth","sneaky","sophisticated","sparkling","special","spectacular","spiritual","successful","succinct","supreme","swanky","sweet","sympathetic","talented","tasteful","terrific","thankful","thoughtful","tidy","tremendous","truthful","unique","upbeat","uppity","victorious","vivacious","wacky","whimsical","whispering","wiggly","wild","willing","witty","wonderful","yummy","zany","zealous","zesty","zippy","zonked"];

    //["agreeable", "alert", "alluring", "ambitious", "amused", "boundless", "brave", "bright", "calm", "capable", "charming", "cheerful", "coherent", "comfortable", "confident", "cooperative", "courageous", "credible", "cultured", "dashing", "dazzling", "debonair", "decisive", "decorous", "delightful", "detailed", "determined", "diligent", "discreet", "dynamic", "eager", "efficient", "elated", "eminent", "enchanting", "encouraging", "endurable", "energetic", "entertaining", "enthusiastic", "excellent", "excited", "exclusive", "exuberant", "fabulous", "fair", "faithful", "fantastic", "fearless", "fine", "frank", "friendly", "funny", "generous", "gentle", "glorious", "good", "happy", "harmonious", "helpful", "hilarious", "honorable", "impartial", "industrious", "instinctive", "jolly", "joyous", "kind", "kind-hearted", "knowledgeable", "level", "likeable", "lively", "lovely", "loving", "lucky", "mature", "modern", "nice", "obedient", "painstaking", "peaceful", "perfect", "placid", "plausible", "pleasant", "plucky", "productive", "protective", "proud", "punctual", "quiet", "receptive", "reflective", "relieved", "resolute", "responsible", "rhetorical", "righteous", "romantic", "sedate", "seemly", "selective", "self-assured", "sensitive", "shrewd", "silly", "sincere", "skillful", "smiling", "splendid", "steadfast", "stimulating", "successful", "succinct", "talented", "thoughtful", "thrifty", "tough", "trustworthy", "unbiased", "unusual", "upbeat", "vigorous", "vivacious", "warm", "willing", "wise", "witty", "wonderful"];


	/**
	 * Phonetics that sound best before a vowel.
	 * @type {Array}
	 */
	static PHONETIC_PRE = [
		// Simple phonetics
		'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p',
		'qu', 'r', 's', 't',
		// Complex phonetics
		'bl',
		'ch', 'cl', 'cr',
		'dr',
		'fl', 'fr',
		'gl', 'gr',
		'kl', 'kr',
		'ph', 'pr', 'pl',
		'sc', 'sh', 'sl', 'sn', 'sr', 'st', 'str', 'sw',
		'th', 'tr',
		'br',
		'v', 'w', 'y', 'z'
	];

	/**
	 * The number of simple phonetics within the 'pre' set.
	 * @type {number}
	 */
	static PHONETIC_PRE_SIMPLE_LENGTH = 16;

	/**
	 * Vowel sound phonetics.
	 * @type {Array}
	 */
	static PHONETIC_MID = [
		// Simple phonetics
		'a', 'e', 'i', 'o', 'u',
		// Complex phonetics
		'ee', 'ie', 'oo', 'ou', 'ue'
	];

	/**
	 * The number of simple phonetics within the 'mid' set.
	 * @type {number}
	 */
	static PHONETIC_MID_SIMPLE_LENGTH = 5;

	/**
	 * Phonetics that sound best after a vowel.
	 * @type {Array}
	 */
	static PHONETIC_POST = [
		// Simple phonetics
		'b', 'd', 'f', 'g', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'y',
		// Complex phonetics
		'ch', 'ck',
		'ln',
		'nk', 'ng',
		'rn',
		'sh', 'sk', 'st',
		'th',
		'x', 'z'
	];

	/**
	 * The number of simple phonetics within the 'post' set.
	 * @type {number}
	 */
	static PHONETIC_POST_SIMPLE_LENGTH = 13;

	/**
	 * A mapping of regular expressions to replacements, which will be run on the
	 * resulting word before it gets returned.  The purpose of replacements is to
	 * address language subtleties that the phonetic builder is incapable of
	 * understanding, such as 've' more pronounceable than just 'v' at the end of
	 * a word, 'ey' more pronounceable than 'iy', etc.
	 * @type {{}}
	 */
	static REPLACEMENTS = {
		'quu': 'que',
		'qu([aeiou]){2}': 'qu$1',
		'[iu]y': 'ey',
		'eye': 'ye',
		'(.)ye$': '$1y',
		'(^|e)cie(?!$)': '$1cei',
		'([vz])$': '$1e',
		'[iu]w': 'ow'
	};

	/**
	 * Adds a single syllable to the word contained in the wordObj.  A syllable
	 * contains, at maximum, a phonetic from each the PRE, MID, and POST phonetic
	 * sets.  Some syllables will omit pre or post based on the
	 * options.compoundSimplicity.
	 *
	 * @param {{word, numeric, lastSkippedPre, lastSkippedPost, opts}} wordObj The
	 *      word object on which to operate.
	 */
	static addSyllable(wordObj) {
		let deriv = Phonetic.getDerivative(wordObj.numeric);
		let compound = deriv % wordObj.opts.compoundSimplicity == 0;
		let first = wordObj.word == '';
		let preOnFirst = deriv % 6 > 0;
		if ((first && preOnFirst) || wordObj.lastSkippedPost || compound) {
			wordObj.word += Phonetic.getNextPhonetic(Phonetic.PHONETIC_PRE, Phonetic.PHONETIC_PRE_SIMPLE_LENGTH, wordObj);
			wordObj.lastSkippedPre = false;
		} else
			wordObj.lastSkippedPre = true;
		wordObj.word += Phonetic.getNextPhonetic(Phonetic.PHONETIC_MID, Phonetic.PHONETIC_MID_SIMPLE_LENGTH, wordObj, first && wordObj.lastSkippedPre);
		if (wordObj.lastSkippedPre || compound) {
			wordObj.word += Phonetic.getNextPhonetic(Phonetic.PHONETIC_POST, Phonetic.PHONETIC_POST_SIMPLE_LENGTH, wordObj);
			wordObj.lastSkippedPost = false;
		} else
			wordObj.lastSkippedPost = true;
	}

	/**
	 * Capitalizes the first letter of a string.
	 *
	 * @param {string} str A string to capitalize
	 * @returns {string} The provided string with the first letter capitalized.
	 */
	static capFirst(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	/**
	 * Gets a derivative of a number by repeatedly dividing it by 7 and adding the
	 * remainders together.  It's useful to base decisions on a derivative rather
	 * than the wordObj's current numeric, as it avoids making the same decisions
	 * around the same phonetics.
	 *
	 * @param {number} num A number from which a derivative should be calculated
	 * @returns {number} The derivative.
	 */
	static getDerivative(num) {
		let derivative = 1;
		while (num != 0) {
			derivative += num % 7;
			num = Math.floor(num / 7);
		}
		return derivative;
	}

	/**
	 * Combines the option defaults with the provided overrides.  Available
	 * options are:
	 *  - syllables: The number of syllables to put in the resulting word.
	 *          Default is 3.
	 *  - seed: A number with which to seed the generator.  Using the
	 *          same seed (with the same other options) will coerce the generator
	 *          into producing the same word. 
	 *  - phoneticSimplicity: The greater this number, the simpler the phonetics.
	 *          For example, 1 might produce 'str' while 5 might produce 's' for
	 *          the same syllable.  Minimum is 1, default is 5.
	 *  - compoundSimplicity: The greater this number, the less likely the
	 *          resulting word will sound "compound", such as "ripkuth" instead of
	 *          "riputh".  Minimum is 1, default is 5.
	 *  - capFirst: true to capitalize the first letter of the word; all lowercase
	 *          otherwise.  Default is false.
	 *
	 * @param {{}} overrides A set of options and values with which to override
	 *      the defaults.
	 * @returns {{syllables, seed, phoneticSimplicity, compoundSimplicity, capFirst}}
	 *      An options object.
	 */
	static getOptions(overrides) {
		let options = {};
		overrides = overrides || {};
		options.syllables = overrides.syllables || 3;
		options.seed = overrides.seed;
		options.phoneticSimplicity = overrides.phoneticSimplicity ? Math.max(overrides.phoneticSimplicity, 1) : 5;
		options.compoundSimplicity = overrides.compoundSimplicity ? Math.max(overrides.compoundSimplicity, 1) : 5;
		options.capFirst = overrides.hasOwnProperty('capFirst') ? overrides.capFirst : false;
		return options;
	}

	/**
	 * Gets the next pseudo-random phonetic from a given phonetic set,
	 * intelligently determining whether to include "complex" phonetics in that
	 * set based on the options.phoneticSimplicity.
	 *
	 * @param {Array} phoneticSet The array of phonetics from which to choose
	 * @param {number} simpleCap The number of 'simple' phonetics at the beginning
	 *      of the phoneticSet
	 * @param {{word, numeric, lastSkippedPre, lastSkippedPost, opts}} wordObj The
	 *      wordObj for which the phonetic is being chosen
	 * @param {boolean} [forceSimple] true to force a simple phonetic to be
	 *      chosen; otherwise, the function will choose whether to include complex
	 *      phonetics based on the derivative of wordObj.numeric.
	 * @returns {string} The chosen phonetic.
	 */
	static getNextPhonetic(phoneticSet, simpleCap, wordObj, forceSimple) {
		let deriv = Phonetic.getDerivative(wordObj.numeric);
		let simple = (wordObj.numeric + deriv) % wordObj.opts.phoneticSimplicity > 0;
		let cap = simple || forceSimple ? simpleCap : phoneticSet.length;
		let phonetic = phoneticSet[wordObj.numeric % cap];
		wordObj.numeric = Phonetic.getNumericHash(wordObj.numeric + wordObj.word);
		return phonetic;
	}

	/**
	 * Generates a numeric hash based on the input data.  The hash is an md5, with
	 * each block of 32 bits converted to an integer and added together.
	 *
	 * @param {string|number} data The string or number to be hashed.
	 * @returns {number}
	 */
	static getNumericHash(data) {
		let hash = blake.blake2b(data);
		let numeric = 0;
		for (let i = 0; i < hash.length; i++) {
			numeric += hash[i];
		}
		return numeric;
	}

	/**
	 * Applies post-processing to a word after it has already been generated.  In
	 * this phase, the REPLACEMENTS are executed, applying language intelligence
	 * that can make generated words more pronounceable.  The first letter is
	 * also capitalized.
	 *
	 * @param {{word, numeric, lastSkippedPre, lastSkippedPost, opts}} wordObj The
	 *      word object to be processed.
	 * @returns {string} The processed word.
	 */
	static postProcess(wordObj) {
		let regex = null;
		for (let i in Phonetic.REPLACEMENTS) {
			if (Phonetic.REPLACEMENTS.hasOwnProperty(i)) {
				regex = new RegExp(i);
				wordObj.word = wordObj.word.replace(regex, Phonetic.REPLACEMENTS[i]);
			}
		}
		if (wordObj.opts.capFirst)
			return Phonetic.capFirst(wordObj.word);
		return wordObj.word;
	}

	/**
	 * Generates a new word based on the given options.  For available options,
	 * see getOptions.
	 *
	 * @param {*} [options] A collection of options to control the word generator.
	 * @returns {string} A generated word.
	 */
	static generate(options) {
		options = Phonetic.getOptions(options);
		let syllables = options.syllables;
		let wordObj = {
				numeric: Phonetic.getNumericHash(options.seed),
				lastSkippedPost: false,
				word: '',
				opts: options
			};
		while (syllables--) {
			Phonetic.addSyllable(wordObj);
		}
		return Phonetic.postProcess(wordObj);
	};

}