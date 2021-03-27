const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('./helpers/logger');
const requestLogger = require('./middlewares/requestLogger');
const authProtect = require('./middlewares/authProtect');

const apiRoute = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;

app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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