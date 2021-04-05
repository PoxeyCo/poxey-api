const validate = require('./../helpers/validate');
const itemActions = require('./../db/item/itemActions');
const logger = require('./../helpers/logger');

module.exports.addItem = async (req, res) => {
    if (req.isAuth === false || req.userPayload.isAdmin === false) {
        return res.status(403).json({
            status: false,
            error: 'You must be logged in and be an admin'
        });
    }

    const errors = validate.validateAddItem(req.body);

    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            errors
        });
    }

    const newItem = await itemActions.addItem(req.body);

    res.status(200).json({
        status: true,
        item: newItem
    });
};

module.exports.getItems = async (req, res) => {
    let { page, limit } = req.query;

    if (isNaN(page) || page === undefined) {
        page = 1;
    }

    if (isNaN(limit) || limit === undefined) {
        limit = 10;
    }

    page = Number(page);
    limit = Number(limit);

    try {
        const items = await itemActions.getAllItems();

        res.status(200).json({
            status: true,
            page,
            totalCount: items.length,
            totalPages: Math.ceil(items.length / limit),
            items: items.slice(limit * (page - 1), limit * page)
        });
    } catch (err) {
        logger.error('Problem with getting all items');

        res.status(500).json({
            status: false,
            error: 'Can not get all items'
        });
    }
};

module.exports.getItem = async (req, res) => {
    const { itemId } = req.params;

    const foundItem = await itemActions.findItemById(itemId);

    if (foundItem === null) {
        return res.status(400).json({
            status: false,
            errors: [1]
        });
    
    }

    res.status(200).json({
        status: true,
        item: foundItem
    });
};