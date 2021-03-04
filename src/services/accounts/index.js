const router = require('./routes');
const logger = require('./../../helpers/logger');

module.exports.accountServiceInit = (app) => {
    app.use('/accounts', router);

    logger.success('Accounts service loaded');
};