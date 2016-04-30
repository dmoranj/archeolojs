var _ = require('underscore'),
    alphabet = {
        letterSeed: {
            b: 12,
            c: 15,
            d: 12,
            f: 10,
            g: 10,
            h: 10,
            j: 10,
            k: 6,
            l: 10,
            m: 12,
            n: 12,
            p: 12,
            q: 6,
            r: 10,
            s: 12,
            t: 10,
            v: 10,
            w: 8,
            x: 6,
            y: 10,
            z: 6
        },
        vowelSeed: {
            a: 10,
            e: 8,
            i: 8,
            o: 10,
            u: 10
        }
    };

function generateSyllable(frequencies) {
  var syl = '';

  syl += frequencies.letters[Math.floor(Math.random()*frequencies.letters.length)];
  syl += frequencies.vowels[Math.floor(Math.random()*frequencies.vowels.length)];

  if (Math.random() < frequencies.doubleConsonant) {
    syl += frequencies.doubleConsonants[Math.floor(Math.random()*frequencies.doubleConsonants.length)];
  }

  return syl;
}

function initFrequencies(letterSeed, vowelSeed, syllables, dblCons, dblConsList) {
  var frequencies = {
      letters: [],
      vowels: [],
      syllables: syllables,
      doubleConsonant: dblCons,
      doubleConsonants: dblConsList
    };

  for (var i in letterSeed) {
    for (var j=0; j < letterSeed[i]; j++) {
      frequencies.letters.push(i);
    }
  }

  for (var i in vowelSeed) {
    for (var j=0; j < vowelSeed[i]; j++) {
      frequencies.vowels.push(i);
    }
  }
  
  return frequencies; 
}

function generateWord(frequencies) {
  var word = '',
      number = 1 + Math.round(frequencies.syllables*Math.random());
  
  for (var i= 0; i < number; i++) {
    word += generateSyllable(frequencies);
  }
  
  return word;
}

function getRandomLetterSeed(letterSeed) {
  var originalSeed = letterSeed,
      keys = _.keys(originalSeed);

  for (var i = 0; i < keys.length; i++) {
    originalSeed[keys[i]] = Math.ceil(originalSeed[keys[i]]*Math.random());
  }

  return originalSeed;
}

function getRandomVowelSeed(vowelSeed) {
    var originalSeed = vowelSeed,
        keys = _.keys(originalSeed);

    for (var i = 0; i < keys.length; i++) {
        originalSeed[keys[i]] = Math.ceil(originalSeed[keys[i]]*Math.random());
    }

    return originalSeed;

}

function getDoubleConsList() {
  return ['r', 's'];
}

function generateFrequencies(alphabet, initialSyllables, doubleConstants) {
  var lSeed = getRandomLetterSeed(alphabet.letterSeed),
      vSeed = getRandomVowelSeed(alphabet.vowelSeed),
      syllables = Math.ceil(initialSyllables*Math.random()),
      doubleConsP = doubleConstants*Math.random(),
      doubleConsList = getDoubleConsList();

  return initFrequencies(lSeed, vSeed, syllables, doubleConsP, doubleConsList);
}

function generateLanguage(freqs) {
    var language = {
        nouns: [],
        roots: [],
        sufixes: [],
        articles: [],
        frequencies: freqs
    }

    for (var i=0; i < freqs.rootN; i++) {
        language.roots.push(generateWord(freqs.rootF));
    }

    for (var i=0; i < freqs.sufixN; i++) {
        language.sufixes.push(generateWord(freqs.sufixF));
    }

    for (var i=0; i < freqs.articleN; i++) {
        language.articles.push(generateWord(freqs.articleF));
    }

    for (var i=0; i < freqs.nounN; i++) {
        language.nouns.push(language.roots[Math.floor(Math.random()*language.roots.length)] +
                            language.sufixes[Math.floor(Math.random()*language.sufixes.length)]);
    }

    return language;
}

function generateSentence(language, n) {
    var text = '';
    for (var i = 0; i < n; i++) {
        if (Math.random() < language.frequencies.articleP) {
            text += language.articles[Math.floor(Math.random()*language.articles.length)] + ' ';
        }

        text += language.nouns[Math.floor(Math.random()*language.nouns.length)];

        if (i < n -1) {
            text += ' ';
        }
    }

    return text && text[0].toUpperCase() + text.slice(1) + '.';
}

function generateLanguageFrequencies(newAlphabet) {
    return {
        rootF: generateFrequencies(newAlphabet, 4, 0.3),
        rootN: 50,
        sufixF: generateFrequencies(newAlphabet, 1, 0.0),
        sufixN: 15,
        nounN: 200,
        articleF: generateFrequencies(newAlphabet, 1, 0.3),
        articleP: 0.8,
        articleN: 8
    };
}

exports.defaultAlphabet = alphabet;
exports.generateLanguage = generateLanguage;
exports.generateLanguageFrequencies = generateLanguageFrequencies;
exports.generateSentence = generateSentence;

/*
language = generateLanguage(generateLanguageFrequencies(alphabet));

console.log('The language: %s', JSON.stringify(language, null, 4));

console.log('A text: %s %s %s %s %s %s',
    generateSentence(language, 15),
    generateSentence(language, 10),
    generateSentence(language, 9),
    generateSentence(language, 17),
    generateSentence(language, 8),
    generateSentence(language, 4));

*/
