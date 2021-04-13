const nodemailer = require('nodemailer');
const validate = require('./../helpers/validate');
const crypt = require('./../helpers/crypt');
const random = require('./../helpers/random');
const jwtToken = require('../helpers/jwtToken');
const userActions = require('./../db/user/userActions');
const recoveryActions = require('./../db/recovery/recoveryAction');
const logger = require('./../helpers/logger');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

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
            cash: foundUser.cash,
            level: foundUser.level,
            expToNextLevel: foundUser.expToNextLevel,
            experience: foundUser.experience
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
            cash: newUser.cash,
            level: newUser.level,
            expToNextLevel: newUser.expToNextLevel,
            experience: newUser.experience
        },
        tokens: {
            access: accessToken,
            refresh: refreshToken
        }
    });
};

module.exports.getUsers = async (req, res) => {
    let { page, limit } = req.query;

    if (isNaN(page) || page === undefined) {
        page = 1;
    }

    if (isNaN(limit) || limit === undefined) {
        limit = 10;
    }

    page = Number(page);
    limit = Number(limit);

    try {
        const rawUsers = await userActions.getAllUsers();

        const users = rawUsers.map((user) => {
            return {
                id: user._id,
                email: user.email,
                username: user.username,
                cash: user.cash,
                registeredOn: user.registeredOn,
                level: user.level,
                experience: user.experience,
                expToNextLevel: user.expToNextLevel,
                isAdmin: user.isAdmin,
                isBanned: user.isBanned,
                banOver: user.banOver
            };
        });

        res.status(200).json({
            status: true,
            page,
            totalCount: users.length,
            totalPages: Math.ceil(users.length / limit),
            users: users.slice(limit * (page - 1), limit * page)
        });
    } catch (err) {
        logger.error('Problem with getting all users');

        res.status(500).json({
            status: false,
            error: 'Can not get all users'
        });
    }
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
            cash: foundUser.cash,
            level: foundUser.level,
            expToNextLevel: foundUser.expToNextLevel,
            experience: foundUser.experience,
        },
    });
};

module.exports.recoverPassword = async (req, res) => {
    const { email } = req.body;

    if (email === undefined) {
        return res.status(400).json({
            status: false,
            errors: [1]
        });
    }

    const foundUser = await userActions.findUserByEmail(email);

    if (foundUser === undefined) {
        return res.status(400).json({
            status: false,
            errors: [2]
        });
    }

    const code = random.randomInteger(111111, 999999);

    const foundRecovery = await recoveryActions.findRecoveryEntityByEmail(email);

    if (foundRecovery) {
        await foundRecovery.updateOne({ email, code });
    }
    else {
        await recoveryActions.addRecoveryEntity({ email, code });
    }

    let info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: '[POXEY] Recover Password',
        html: `<h1>POXEY Password Recovery</h1><p>Recover code: <b>${code}</b></p>`
    });

    return res.status(200).json({
        status: true,
        data: info
    });
};

module.exports.checkCode = async (req, res) => {
    const { email, code } = req.body;

    if (email === undefined) {
        return res.status(400).json({
            status: false,
            errors: [1]
        });
    }

    if (code === undefined || isNaN(code)) {
        return res.status(400).json({
            status: false,
            errors: [2]
        });
    }

    const recoveryEntity = await recoveryActions.findRecoveryEntityByEmail(email);

    if (recoveryEntity === null) {
        return res.status(400).json({
            status: false,
            errors: [3]
        });
    }

    if (code !== recoveryEntity.code) {
        return res.status(400).json({
            status: false,
            errors: [4]
        });
    }

    recoveryEntity.set('isCodeChecked', true);
    await recoveryEntity.save();

    res.status(200).json({
        status: true
    });
};

module.exports.updateRecoverPassword = async (req, res) => {
    const { email, password } = req.body;

    if (email === undefined) {
        return res.status(400).json({
            status: false,
            errors: [1]
        });
    }

    const foundRecovery = await recoveryActions.findRecoveryEntityByEmail(email);

    if (foundRecovery === undefined) {
        return res.status(400).json({
            status: false,
            errors: [2]
        });
    }

    if (foundRecovery.isCodeChecked === false) {
        return res.status(400).json({
            status: false,
            errors: [3]
        });
    }

    if (validate.validatePassword(password) === false) {
        return res.status(400).json({
            status: false,
            errors: [4]
        });
    }

    const hashedPassword = await crypt.hashPassword(password);
    const foundUser = await userActions.findUserByEmail(email);

    await foundUser.updateOne({ password: hashedPassword });
    await foundRecovery.deleteOne();

    res.status(200).json({
        status: true
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