const express = require('express');

const accountsController = require('./../controllers');

const router = express.Router();

router.get('/', accountsController.getAccount);

module.exports = router;