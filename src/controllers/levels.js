const validate = require('./../helpers/validate');
const logger = require('./../helpers/logger');
const levelActions = require('./../db/level/levelActions');
const itemActions = require('./../db/item/itemActions');

module.exports.addLevel = async (req, res) => {
    if (req.isAuth === false || req.userPayload.isAdmin === false) {
        return res.status(403).json({
            status: false,
            error: 'You must be logged in and be an admin'
        });
    }

    const errors = validate.validateAddLevel(req.body);

    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            errors
        });
    }

    const { number, dropItems } = req.body;

    try {
        const foundLevel = await levelActions.findLevelByNumber(number);

        if (foundLevel) {
            if (errors.length > 0) {
                return res.status(400).json({
                    status: false,
                    errors: [4]
                });
            }
        }
    } catch (err) {
        logger.error('Problem with finding level by number');
    }

    const itemIds = dropItems.map((item) => item.itemId);
    const isValidItems = await itemActions.isValidItems(itemIds);

    if (isValidItems === false) {
        return res.status(400).json({
            status: false,
            errors: [5]
        });
    }

    try {
        const newLevel = await levelActions.addLevel(req.body);

        res.status(200).json({
            status: true,
            level: newLevel
        });
    } catch (err) {
        logger.error('Problem with creating level');

        res.status(500).json({
            status: false,
            error: 'Can not create a new level'
        });
    }
};

module.exports.getLevels = async (req, res) => {
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
        const levels = await levelActions.getAllLevels();

        res.status(200).json({
            status: true,
            totalCount: levels.length,
            totalPages: Math.floor(levels.length / limit) + 1,
            levels: levels.slice(limit * (page - 1), limit * page)
        });
    } catch (err) {
        logger.error('Problem with getting all levels');

        res.status(500).json({
            status: false,
            error: 'Can not get all levels'
        });
    }
};

module.exports.getLevelByNumber = async (req, res) => {
    const { number } = req.params;

    if (isNaN(number) || number < 1) {
        return res.status(400).json({
            status: false,
            error: 'Incorrect level number'
        });
    }

    const level = await levelActions.findLevelByNumber(number);

    if (level === null) {
        return res.status(400).json({
            status: false,
            error: 'Can not find level with this number'
        });
    }

    res.status(200).json({
        status: true,
        level
    });
};