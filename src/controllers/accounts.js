const validate = require('./../helpers/validate');
const crypt = require('./../helpers/crypt');
const jwtToken = require('../helpers/jwtToken');
const userActions = require('./../db/user/userActions');

module.exports.signIn = async (req, res) => {
    const { login, password } = req.body;
    const errors = await validate.validateSignIn({ login, password });

    if (errors.length !== 0) {
        return res.status(400).json({
            status: false,
            errors
        });
    }

    let foundUser = validate.validateEmail(login) ? await userActions.findUserByEmail(login) : await userActions.findUserByName(login);

    if (foundUser === null) {
        return res.status(400).json({
            status: false,
            errors: [3]
        });
    }

    const passwordMatch = await crypt.comparePassword(password, foundUser.password);

    if (passwordMatch === false) {
        return res.status(400).json({
            status: false,
            errors: [4]
        });
    }

    const accessToken = await jwtToken.generateAccess(foundUser);
    const refreshToken = await jwtToken.generateRefresh(foundUser);

    res.status(200).json({
        status: true,
        user: {
            _id: foundUser._id,
            email: foundUser.email,
            username: foundUser.username,
            avatarId: foundUser.avatarId,
            cash: foundUser.cash
        },
        tokens: {
            access: accessToken,
            refresh: refreshToken
        }
    });
};

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

module.exports.getUserInfo = async (req, res) => {
    const { id } = req.params;

    const foundUser = await userActions.findUserById(id);

    if (foundUser === null) {
        return res.status(400).json({
            status: false,
            error: 'Cant find user with given id'
        });
    }

    res.status(200).json({
        status: true,
        user: {
            _id: foundUser._id,
            email: foundUser.email,
            username: foundUser.username,
            avatarId: foundUser.avatarId,
            cash: foundUser.cash
        },
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