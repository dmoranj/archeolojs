var clUtils = require('command-node'),
    languageLib = require('./language'),
    async = require('async'),
    apply = async.apply,
    fs = require('fs'),
    maxAlphabets = 50,
    wordNumber = 30,
    alphabetSelection,
    fitnessValues,
    alphabetPool = [];

function generateRandomAlphabet() {
    var alphabet = {
            letterSeed: {},
            vowelSeed: {}
        },
        consonants = 'bcdfghjklmnpqrstvwxyz',
        vowels = 'aeiou';

    for (var i = 0; i < consonants.length; i++) {
        alphabet.letterSeed[consonants[i]] = Math.round(Math.random()*20);
    }

    for (var i = 0; i < vowels.length; i++) {
        alphabet.vowelSeed[vowels[i]] = Math.round(Math.random()*20);
    }

    return alphabet;
}

function loadLanguage() {
    console.log('Loading new language parameters');
}

function newAlphabet() {
    console.log('Initializing new alphabet pool');

    alphabetPool = [];
    fitnessValues = [];

    for (var i = 0; i < maxAlphabets; i++) {
        alphabetPool.push(generateRandomAlphabet());
        fitnessValues.push(5);
    }
}

function nextRound() {
    console.log('Creating the next generation from the previous one');

    function orderFitness(population, callback) {
        var moved = true,
            minimum = [];

        while (moved) {
            for (var i = 0; i < fitnessValues.length; i++) {

            }
        }
    }

    function killUnfit(population, callback) {

    }

    function crossPopulation(population, callback) {

    }

    function mutateIndividuals(population, callback) {

    }

    async.waterfall([
        apply(orderFitness, alphabetPool),
        killUnfit,
        crossPopulation,
        mutateIndividuals
    ], function(error) {
        if (error) {
            console.log('There was an error advancing to a new generation');
        } else {
            console.log('Generation advanced successfully');
        }
    });
}

function measure() {
    var language;

    console.log('Extracting extracts from 10 random alphabets');
    alphabetSelection = [];

    for (var j = 0; j < 10; j++) {
        var found = false,
            index;

        while(!found) {
            var index = Math.floor(Math.random()*alphabetPool.length);

            if (alphabetSelection.indexOf(index) < 0) {
                found = true;
                alphabetSelection.push(index);
            }
        }
    }

    for (var i = 0; i < alphabetSelection.length; i++) {
        language = languageLib.generateLanguage(
            languageLib.generateLanguageFrequencies(alphabetPool[alphabetSelection[i]]));

        console.log('\nExcerpt number with ID %d [%d]: \n%s %s %s\n', alphabetSelection[i], i,
            languageLib.generateSentence(language, 15),
            languageLib.generateSentence(language, 15),
            languageLib.generateSentence(language, 15));
    }
}

function evaluate(commands) {
    if (!commands[0].match(/\d\d\d\d\d\d\d\d\d\d/)) {
        console.log('Please, enter an ordered list of ten different numbers, without spaces nor commas.');
    } else {
        for (var i = 0; i < 10; i++) {
            fitnessValues[alphabetSelection[commands[0][i]]] = 10 - i;
            alphabetPool[alphabetSelection[commands[0][i]]].fitness = 10 -i;
        }

        console.log('Excerpts evaluated');
    }

    clUtils.prompt();
}

function save(commands) {
    console.log('Saving the alphabet corresponding to the selected excerpt');

    fs.writeFile(commands[1], JSON.stringify(alphabetPool[commands[0]], null, 4), function(error) {
        if (error) {
            console.log('Couldn\'t write %s file.', commands[1]);
        } else {
            console.log('File %s written successfully', commands[1]);
        }

        clUtils.prompt();
    });
}

function show(commands) {
    console.log('Alphabet number [%s]: \n%s\n', commands[0], JSON.stringify(alphabetPool[commands[0]], null, 4));
}

function fitness(commands) {
    console.log('Fitness values: \n');

    for (var i = 0; i < fitnessValues.length; i++) {
        console.log('\t[%d] = %d', i, fitnessValues[i]);
    }
}

var commands = {
    'loadLanguage': {
        parameters: ['filename'],
        description: '\tLoads the language description that will be used to generate the languages that would\n' +
            '\tgenerate the candidate texts.',
        handler: loadLanguage
    },
    'new': {
        parameters: [],
        description: '\tGenerates a new alphabet to start the selection process',
        handler: newAlphabet
    },
    'nextRound': {
        parameters: [],
        description: '\tCreates a new generation of languages based on the stored fitness values.',
        handler: nextRound
    },
    'measure': {
        parameters: [],
        description: '\tShow a random selection of alphabets from the last generation, in order to evaluate it.',
        handler: measure
    },
    'evaluate': {
        parameters: ['classification'],
        description: '\tGet a classification of the more suitable alphabets. The classification should contain\n' +
        '\tthe numbers from 0 to 9 in any order, referred to excerpts generated in the last measure command.',
        handler: evaluate
    },
    'fitness': {
        parameters: [],
        description: '\tShow the current array of fitness values for each alphabet',
        handler: fitness
    },
    'show': {
        parameters: ['number'],
        description: '\tShow the selected alphabet.',
        handler: show
    },
    'save': {
        parameters: ['number', 'filename'],
        description: '\tSave the selected alphabet from the last measure excerpt into the selected filename.',
        handler: save
    }
};

clUtils.initialize(commands, 'Alphabet > ');
