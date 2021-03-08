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

    const dbAdventure = new Adventure(newAdventure);

    try {
        await dbAdventure.save();
    } catch (err) {
        logger.error('Error with creating item');
    }

    return Object.freeze(dbAdventure);
};

module.exports.findAdventureById = async (id) => {
    try {
        const foundAdventure = await Adventure.findOne({ _id: id });
        return foundAdventure;
    } catch (e) {
        return null;
    }
};