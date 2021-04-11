const User = require('./userModel');
const logger = require('./../../helpers/logger');
const random = require('./../../helpers/random');

module.exports.addUser = async ({ email, username, password }) => {
    const newUserObject = {
        email,
        username,
        password,
        cash: 0.0,
        avatarId: random.randomInteger(1, 5)
    };

    try {
        const dbUser = new User(newUserObject);
        await dbUser.save();

        return Object.freeze(dbUser);
    } catch (err) {
        logger.error('Error with creating user');
        return null;
    }
};

module.exports.getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (e) {
        logger.error('Error with getting all users');
        return null;
    }
};

module.exports.findUserById = async (id) => {
    try {
        const foundUser = await User.findOne({ _id: id });
        return foundUser;
    } catch (e) {
        logger.error('Error with finding user by id');
        return null;
    }
};

module.exports.findUserByEmail = async (email) => {
    try {
        const foundUser = await User.findOne({ email });
        return foundUser;
    } catch (e) {
        logger.error('Error with finding user by email');
        return null;
    }
};

module.exports.findUserByName = async (username) => {
    try {
        const foundUser = await User.findOne({ username });
        return foundUser;
    } catch (e) {
        logger.error('Error with finding user by username');
        return null;
    }
};
