const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

module.exports.generateAccess = async ({ _id, email }) => {
    const payload = {
        id: _id.toString(),
        email
    };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
        jwtid: uuidv4(),
        subject: _id.toString()
    });

    return token;
};

module.exports.generateRefresh = async ({ _id, email }) => {
    const payload = {
        id: _id.toString(),
        email
    };

    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
        jwtid: uuidv4(),
        subject: _id.toString()
    });

    return token;
};

module.exports.verifyAccess = async (token) => {
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return payload;
    } catch (err) {
        return {};
    }
};

module.exports.verifyRefresh = async (token) => {
    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        return payload;
    } catch (err) {
        return {};
    }
};