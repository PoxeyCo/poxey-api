const express = require('express');
const accountsController = require('./../controllers/accounts');

const router = express.Router();

router.post('/signin', accountsController.signIn);
router.post('/register', accountsController.register);
router.post('/refresh-token', accountsController.refreshToken);
router.get('/:id', accountsController.getUserInfo);

module.exports.init = (app, apiVersion, logger) => {
    app.use(`${apiVersion}/accounts`, router);
    logger.success('Accounts service loaded');
};