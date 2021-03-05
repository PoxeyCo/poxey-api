const express = require('express');
const mongoose = require('mongoose');
const logger = require('./helpers/logger');
const requestLogger = require('./helpers/requestLogger');

const apiRoute = require('./routes/index');

const app = express();
const port = 3000;

app.use(express.json());
app.use(requestLogger);

apiRoute.initRoutes(app);

mongoose.connect('mongodb://localhost:27017/poxey', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        logger.success('Connected to database "Poxey"');
        app.listen(port, () => {
            logger.success(`Server is listening on port ${port}`);
        });
    })
    .catch(err => {
        console.log(err);
    });