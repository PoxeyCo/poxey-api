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

    try {
        const dbItem = new Item(newItem);
        await dbItem.save();

        return Object.freeze(dbItem);
    } catch (err) {
        logger.error('Error with creating item');
        return null;
    }
};

module.exports.getAllItems = async () => {
    try {
        const items = await Item.find();
        return items;
    } catch (e) {
        logger.error('Error with getting all items');
        return null;
    }
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
    try {
        const foundItems = await Item.find({ title });
        return foundItems;
    } catch (e) {
        logger.error('Error with find items by title');
        return null;
    }
};

module.exports.findItemsByType = async (type) => {
    try {
        const foundItems = await Item.find({ type });
        return foundItems;
    } catch(e) {
        logger.error('Error with finding items by type');
        return null;
    }
};

module.exports.isValidItems = async (itemIds) => {
    return new Promise((resolve, reject) => {
        itemIds.forEach(async (id, index) => {
            const foundItem = await this.findItemById(id);

            if (foundItem === null) {
                resolve(false);
            }

            if (index + 1 >= itemIds.length) {
                resolve(true);
            }
        });
    });
};