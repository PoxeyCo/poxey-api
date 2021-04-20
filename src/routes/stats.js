const express = require('express');
const statsController = require('./../controllers/stats');

const router = express.Router();

router.get('/counts', statsController.getCounts);

module.exports.init = (app, apiVersion, logger) => {
    app.use(`${apiVersion}/stats`, router);
    logger.success('Stats service loaded');
};