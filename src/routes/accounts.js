const express = require('express');
const accountsController = require('./../controllers/accounts');

const router = express.Router();

router.get('/', accountsController.getUsers);
router.get('/:id', accountsController.getUserInfo);

router.post('/signin', accountsController.signIn);
router.post('/register', accountsController.register);
router.post('/refresh-token', accountsController.refreshToken);

router.post('/recover/code', accountsController.checkCode);
router.post('/recover/password', accountsController.updateRecoverPassword);
router.post('/recover', accountsController.recoverPassword);

module.exports.init = (app, apiVersion, logger) => {
    app.use(`${apiVersion}/accounts`, router);
    logger.success('Accounts service loaded');
};