const jwtToken = require('../helpers/jwtToken');

module.exports = async (req, res, next) => {
    if (!req.headers['authorization']) {
        req.isAuth = false;
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    const tokenPayload = await jwtToken.verifyAccess(token);

    if (tokenPayload.id === undefined) {
        req.isAuth = false;
        return next();
    }
    else {
        req.isAuth = true;
        req.userPayload = tokenPayload;
    }

    next();
};