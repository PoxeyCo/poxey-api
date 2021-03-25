const validate = require('./../helpers/validate');
const logger = require('./../helpers/logger');
const levelActions = require('./../db/level/levelActions');

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

    const { number, power, duration, dropItems } = req.body;

    const itemIds = dropItems.map((item) => item.itemId);
    console.log(itemIds);

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

    // try {
    //     const newLevel = await levelActions.addLevel(req.body);

    //     res.status(200).json({
    //         status: true,
    //         level: newLevel
    //     });
    // } catch (err) {
    //     logger.error('Problem with creating level');

    //     res.status(500).json({
    //         status: false,
    //         error: 'Can not create a new level'
    //     });
    // }

    res.send(1);
};