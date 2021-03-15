const Adventure = require('./adventureModel');
const levelActions = require('./../level/levelActions');
const logger = require('./../../helpers/logger');

module.exports.addAdventure = async ({ userId, characterId, levelId }) => {
    const choosedLevel = await levelActions.findLevelById(levelId);

    const endTime = Date.now() + (choosedLevel.duration * 1000);

    const newAdventure = {
        userId,
        characterId,
        levelId,
        endTime
    };


    try {
        const dbAdventure = new Adventure(newAdventure);
        await dbAdventure.save();

        return Object.freeze(dbAdventure);
    } catch (err) {
        logger.error('Error with creating item');
        return null;
    }
};

module.exports.findAdventureById = async (id) => {
    try {
        const foundAdventure = await Adventure.findOne({ _id: id });
        return foundAdventure;
    } catch (e) {
        logger.error('Error with finding adventure by id');
        return null;
    }
};