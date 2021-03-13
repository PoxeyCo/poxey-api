const logger = require('./../helpers/logger');
const accountsRoute = require('./accounts');
const charactersRoute = require('./characters');
const itemsRoute = require('./items');
const levelsRoute = require('./levels');

const apiVersion = '/api/v1';

module.exports.initRoutes = (app) => {
    logger.info('Loading all services...');

    accountsRoute.init(app, apiVersion, logger);
    charactersRoute.init(app, apiVersion, logger);
    itemsRoute.init(app, apiVersion, logger);
    levelsRoute.init(app, apiVersion, logger);
};