const express = require('express');
const prizesController = require('./../controllers/prizes');

const router = express.Router();

router.get('/', prizesController.getPrize);

module.exports.init = (app, apiVersion, logger) => {
    app.use(`${apiVersion}/prizes`, router);
    logger.success('Prizes service loaded');
};