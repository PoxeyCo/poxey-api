const express = require('express');
const levelsController = require('./../controllers/levels');

const router = express.Router();

router.post('/', levelsController.addLevel);

module.exports.init = (app, apiVersion, logger) => {
    app.use(`${apiVersion}/levels`, router);
    logger.success('Levels service loaded');
};