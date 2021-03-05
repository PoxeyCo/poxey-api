const express = require('express');
const logger = require('./helpers/logger');
const requestLogger = require('./helpers/requestLogger');

const apiRoute = require('./routes/index');

const app = express();
const port = 3000;

app.use(requestLogger);

apiRoute.initRoutes(app);

app.listen(port, () => {
    logger.success(`Server is listening on port ${port}`);
});