const validate = require('./../helpers/validate');
const crypt = require('./../helpers/crypt');
const jwtToken = require('../helpers/jwtToken');
const userActions = require('./../db/user/userActions');

module.exports.register = async (req, res) => {
    const { email, username, password } = req.body;
    const errors = await validate.validateRegister({ email, username, password, userActions });

    if (errors.length !== 0) {
        return res.status(400).json({
            status: false,
            errors
        });
    }

    const hashedPassword = await crypt.hashPassword(password);

    const newUser = await userActions.addUser({
        email,
        username,
        password: hashedPassword
    });

    const accessToken = await jwtToken.generateAccess(newUser);
    const refreshToken = await jwtToken.generateRefresh(newUser);

    res.status(201).json({
        status: true,
        user: {
            _id: newUser._id,
            email: newUser.email,
            username: newUser.username,
            avatarId: newUser.avatarId,
            cash: newUser.cash
        },
        tokens: {
            access: accessToken,
            refresh: refreshToken
        }
    });
};

module.exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            status: false,
            error: 'Provide a valide refresh token'
        });
    }

    const payload = await jwtToken.verifyRefresh(refreshToken);

    if (payload.id === undefined) {
        return res.status(405).json({
            status: false,
            error: 'Provide a valide refresh token'
        });
    }

    const newAccessToken = await jwtToken.generateAccess({ _id: payload.id, email: payload.email });
    const newRefreshToken = await jwtToken.generateRefresh({ _id: payload.id, email: payload.email });

    res.status(200).json({
        status: true,
        tokens: {
            access: newAccessToken,
            refresh: newRefreshToken
        }
    })
};