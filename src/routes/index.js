const fs = require('fs');
const logger = require('./../helpers/logger');

const files = fs.readdirSync('./src/routes');
const apiVersion = '/api/v1';

module.exports.initRoutes = (app) => {
    logger.info('Loading all services...');

    files.forEach((file) => {
        if (file !== 'index.js') {
            require(`./${file}`).init(app, apiVersion, logger);
        }
    });
};