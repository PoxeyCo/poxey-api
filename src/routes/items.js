const express = require('express');
const itemsController = require('./../controllers/items');

const router = express.Router();

router.get('/', itemsController.getItems);
router.get('/:itemId', itemsController.getItem);

router.post('/', itemsController.addItem);

module.exports.init = (app, apiVersion, logger) => {
    app.use(`${apiVersion}/items`, router);
    logger.success('Items service loaded');
};