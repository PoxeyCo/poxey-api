const logger = require('./../helpers/logger');
const accountsRoute = require('./accounts');
const charactersRoute = require('./characters');

const apiVersion = '/api/v1';

module.exports.initRoutes = (app) => {
    logger.info('Loading all services...');

    accountsRoute.init(app, apiVersion, logger);
    charactersRoute.init(app, apiVersion, logger);
};