const Item = require('./itemModel');
const itemTypes = require('./../../types/itemTypes');
const rarityTypes = require('./../../types/rarityTypes');
const logger = require('./../../helpers/logger');

module.exports.addItem = async ({ title, description, rarity, type, power }) => {
    const newItem = {
        title,
        description,
        rarity: rarityTypes[rarity.toUpperCase()],
        type: itemTypes[type.toUpperCase()],
        power
    };

    const dbItem = new Item(newItem);

    try {
        await dbItem.save();
    } catch (err) {
        logger.error('Error with creating item');
    }

    return Object.freeze(dbItem);
};

module.exports.findItemById = async (id) => {
    try {
        const foundItem = await Item.findOne({ _id: id });
        return foundItem;
    } catch (e) {
        return null;
    }
};

module.exports.findItemsByTitle = async (title) => {
    const foundItems = await Item.find({ title });

    return foundItems;
};

module.exports.findItemsByType = async (type) => {
    const foundItems = await Item.find({ type });

    return foundItems;
};