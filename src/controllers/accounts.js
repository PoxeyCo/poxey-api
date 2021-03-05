const validate = require('./../helpers/validate');
const crypt = require('./../helpers/crypt');
const userActions = require('./../db/user/userActions');

module.exports.getAccount = (req, res) => {
    res.send('THERE IS AN ACCOUNT');
};

module.exports.register = async (req, res) => {
    const { email, username, password } = req.body;
    const errors = validate.validateRegister({ email, username, password });

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

    res.status(201).json({
        status: true,
        user: {
            _id: newUser._id,
            email: newUser.email,
            username: newUser.username,
            avatarId: newUser.avatarId,
            cash: newUser.cash
        }
    });
};