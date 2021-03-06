const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('./helpers/logger');
const requestLogger = require('./middlewares/requestLogger');
const authProtect = require('./middlewares/authProtect');

const apiRoute = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);
app.use(authProtect);

apiRoute.initRoutes(app);

mongoose.connect(process.env.DB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        logger.success('Connected to database "Poxey"');
        app.listen(port, () => {
            logger.success(`Server is listening on port ${port}`);
        });
    })
    .catch(err => {
        logger.error(err);
    });