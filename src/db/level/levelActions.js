const Level = require('./levelModel');
const logger = require('./../../helpers/logger');

module.exports.addLevel = async ({ number, power, dropItems, duration }) => {
    const newLevel = {
        number,
        power,
        dropItems,
        duration
    };

    const dbLevel = new Level(newLevel);

    try {
        await dbLevel.save();
    } catch (err) {
        logger.error('Error with creating item');
    }

    return Object.freeze(dbLevel);
};

module.exports.findLevelById = async (id) => {
    try {
        const foundLevel = await Level.findOne({ _id: id });
        return foundLevel;
    } catch (e) {
        return null;
    }
};

module.exports.findLevelByNumber = async (number) => {
    const foundLevel = await Level.findOne({ number });

    return foundLevel;
};