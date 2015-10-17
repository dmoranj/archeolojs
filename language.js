var _ = require('underscore'),
    letterSeed = {
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
    vowelSeed = {
      a: 10,
      e: 8,
      i: 8,
      o: 10,
      u: 10
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
      number = 1 + Math.floor(frequencies.syllables*Math.random());
  
  for (var i= 0; i < number; i++) {
    word += generateSyllable(frequencies);
  }
  
  return word;
}

function getRandomLetterSeed() {
  var originalSeed = letterSeed,
      keys = _.keys(originalSeed);

  for (var i = 0; i < keys.length; i++) {
    originalSeed[keys[i]] = Math.floor(originalSeed[keys[i]]*Math.random());
  }

  return originalSeed;
}

function getRandomVowelSeed() {
    var originalSeed = vowelSeed,
        keys = _.keys(originalSeed);

    for (var i = 0; i < keys.length; i++) {
        originalSeed[keys[i]] = Math.floor(originalSeed[keys[i]]*Math.random());
    }

    return originalSeed;

}

function getDoubleConsList() {
  return ['r', 's'];
}

function generateFrequencies(initialSyllables, doubleConstants) {
  var lSeed = getRandomLetterSeed(),
      vSeed = getRandomVowelSeed(),
      syllables = Math.ceil(initialSyllables*Math.random()),
      doubleConsP = doubleConstants*Math.random(),
      doubleConsList = getDoubleConsList();

  return initFrequencies(lSeed, vowelSeed, syllables, doubleConsP, doubleConsList);
}

languageFrequencies = {
    rootF: generateFrequencies(4, 0.3),
    rootN: 150,
    sufixF: generateFrequencies(1, 0.0),
    sufixN: 20,
    nounN: 400,
    articleF: generateFrequencies(1, 0.3),
    articleP: 0.8,
    articleN: 12
};

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

language = generateLanguage(languageFrequencies);

console.log('The language: %s', JSON.stringify(language, null, 4));

console.log('A text: %s %s %s %s %s %s',
    generateSentence(language, 15),
    generateSentence(language, 10),
    generateSentence(language, 9),
    generateSentence(language, 17),
    generateSentence(language, 8),
    generateSentence(language, 4));

