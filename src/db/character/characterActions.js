const Character = require('./characterModel');
const logger = require('./../../helpers/logger');
const ObjectId = require('mongodb').ObjectId;

module.exports.createCharacter = async ({ userId }) => {
    const newCharacter = {
        userId: ObjectId(userId)
    };

    const dbCharacter = new Character(newCharacter);

    try {
        await dbCharacter.save();
    } catch (err) {
        logger.error('Error with creating character');
    }

    return Object.freeze(dbCharacter);
};

module.exports.findCharacterById = async (id) => {
    try {
        const foundCharacter = await Character.findOne({ _id: id });
        return foundCharacter;
    } catch (e) {
        return null;
    }
};