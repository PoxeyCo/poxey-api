const express = require('express');
const adventuresController = require('./../controllers/adventures');

const router = express.Router();

router.get('/', adventuresController.getAdventure);

router.post('/', adventuresController.startAdventure);

router.patch('/:id', adventuresController.completeAdventure);

module.exports.init = (app, apiVersion, logger) => {
    adventuresController.syncAdventures();

    app.use(`${apiVersion}/adventures`, router);
    logger.success('Adventures service loaded');
};