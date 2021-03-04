const { accountServiceInit } = require('./accounts/index');
const logger = require('./../helpers/logger');

const apiVersion = '/api/v1';

module.exports.servicesInit = (app) => {
    logger.info('Loading all services...');

    accountServiceInit(app, apiVersion);
};