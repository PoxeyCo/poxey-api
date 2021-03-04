const { accountServiceInit } = require('./accounts/index');
const logger = require('./../helpers/logger');

module.exports.servicesInit = (app) => {
    logger.info('Loading all services...');

    accountServiceInit(app);
};