const Character = require('./characterModel');
const logger = require('./../../helpers/logger');
const ObjectId = require('mongodb').ObjectId;

module.exports.createCharacter = async ({ userId }) => {
    const newCharacter = {
        userId: ObjectId(userId)
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