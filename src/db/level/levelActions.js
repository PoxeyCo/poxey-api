const Level = require('./levelModel');
const logger = require('./../../helpers/logger');

module.exports.addLevel = async ({ number, power, dropItems, duration }) => {
    const newLevel = {
        number,
        power,
        dropItems,
        duration
    };

    try {
        const dbLevel = new Level(newLevel);
        await dbLevel.save();

        return Object.freeze(dbLevel);
    } catch (err) {
        logger.error('Error with creating level');
        return null;
    }
};

module.exports.getAllLevels = async () => {
    try {
        const levels = await Level.find();
        return levels;
    } catch (e) {
        logger.error('Error with getting all levels');
        return null;
    }
};

module.exports.getLevelsInRange = async (min, max) => {
    try {
        const levels = await Level.find({ number: { $gte: min, $lte: max } });
        return levels;
    } catch (e) {
        logger.error('Error with getting levels in range');
        return null;
    }
};

module.exports.findLevelById = async (id) => {
    try {
        const foundLevel = await Level.findOne({ _id: id });
        return foundLevel;
    } catch (e) {
        logger.error('Error with finding level by id');
        return null;
    }
};

module.exports.findLevelByNumber = async (number) => {
    try {
        const foundLevel = await Level.findOne({ number });
        return foundLevel;
    } catch (e) {
        logger.error('Error with finding level by number');
        return null;
    }
};