const Adventure = require('./adventureModel');
const levelActions = require('./../level/levelActions');
const logger = require('./../../helpers/logger');

module.exports.addAdventure = async ({ userId, characterId, levelId }) => {
    const choosedLevel = await levelActions.findLevelById(levelId);

    const endTime = Date.now() + (choosedLevel.duration);

    const newAdventure = {
        userId,
        characterId,
        levelId,
        endTime
    };

    try {
        const dbAdventure = new Adventure(newAdventure);
        await dbAdventure.save();

        return dbAdventure;
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

module.exports.findAdventureByUserId = async (id) => {
    try {
        const foundAdventure = await Adventure.findOne({ userId: id });
        return foundAdventure;
    } catch (e) {
        logger.error('Error with finding adventure by id');
        return null;
    }
};

module.exports.getAllAdventures = async () => {
    try {
        const allAdventures = await Adventure.find();
        return allAdventures;
    } catch (e) {
        logger.error('Error with getting all adventures');
        return null;
    }
};

module.exports.findCompletedAdventure = async (id) => {
    try {
        const foundAdventure = await Adventure.findOne({ _id: id, isCompleted: true });
        return foundAdventure;
    } catch (e) {
        logger.error('Error with finding completed adventure');
        return null;
    }
};