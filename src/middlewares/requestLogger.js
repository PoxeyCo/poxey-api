const logger = require('./../helpers/logger');

module.exports = (req, res, next) => {
    logger.request(req);
    next()
};