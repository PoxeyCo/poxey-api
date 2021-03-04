const router = require('./routes');
const logger = require('./../../helpers/logger');

module.exports.accountServiceInit = (app, apiVersion) => {
    app.use(`${apiVersion}/accounts`, router);

    logger.success('Accounts service loaded');
};