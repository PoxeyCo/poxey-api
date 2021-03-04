const { model } = require("mongoose");

const logger = require('./logger');

module.exports = (req, res, next) => {
    logger.request(req);
    next()
};