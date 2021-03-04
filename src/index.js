const express = require('express');
const logger = require('./helpers/logger');
const requestLogger = require('./helpers/requestLogger');

const { servicesInit } = require('./services/index');

const app = express();
const port = 3000;

app.use(requestLogger);

servicesInit(app);

app.listen(port, () => {
    logger.success(`Server is listening on port ${port}`);
});