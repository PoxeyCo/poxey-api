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

    const dbUser = new User(newUserObject);

    try {
        await dbUser.save();
    } catch (err) {
        logger.error('Error with creating user');
    }

    return Object.freeze(dbUser);
};

module.exports.findUserByEmail = async (email) => {
    const foundUser = await User.findOne({ email });

    return foundUser;
};

module.exports.findUserByName = async (username) => {
    const foundUser = await User.findOne({ username });

    return foundUser;
}