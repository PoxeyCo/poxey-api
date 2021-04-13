const Character = require('./characterModel');
const logger = require('./../../helpers/logger');
const ObjectId = require('mongodb').ObjectId;
const random = require('./../../helpers/random');
const itemActions = require('./../item/itemActions');

module.exports.createCharacter = async ({ userId }) => {
    const defaultItems = ['606033503b3b550004aac9fe', '606033fd3b3b550004aaca08', '6060349b3b3b550004aaca11'];
    const defaultPokemons = { '606b01209346b5272a47b395': 47, '606b01239346b5272a47b398': 49.75, '606b01269346b5272a47b39b': 50 };

    const startPokemonId = Object.keys(defaultPokemons)[random.randomInteger(0, 3 - 1)];

    const newCharacter = {
        userId: ObjectId(userId),
        selectedItems: {
            helmet: null,
            chest: '606033503b3b550004aac9fe',
            boots: '606033fd3b3b550004aaca08',
            weapon: '6060349b3b3b550004aaca11'
        },
        power: 14 + defaultPokemons[startPokemonId],
        items: defaultItems,
        pokemons: [startPokemonId]
    };

    try {
        const dbCharacter = new Character(newCharacter);
        await dbCharacter.save();

        return Object.freeze(dbCharacter);
    } catch (err) {
        logger.error('Error with creating character');
        return null;
    }
};

module.exports.findCharacterById = async (id) => {
    try {
        const foundCharacter = await Character.findOne({ _id: id });
        return foundCharacter;
    } catch (e) {
        logger.error('Error with finding character by id');
        return null;
    }
};