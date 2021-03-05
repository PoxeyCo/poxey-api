const express = require('express');
const accountsController = require('./../controllers/accounts');

const router = express.Router();

router.get('/', accountsController.getAccount);
router.post('/register', accountsController.register);

module.exports.init = (app, apiVersion, logger) => {
    app.use(`${apiVersion}/accounts`, router);
    logger.success('Accounts service loaded');
};