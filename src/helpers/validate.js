const rarityTypes = require('./../types/rarityTypes');
const itemTypes = require('./../types/itemTypes');

module.exports.validateSignIn = async ({ login, password }) => {
    const errors = [];

    if (login === undefined) {
        errors.push(1);
    }

    if (this.validatePassword(password) === false && password === undefined) {
        errors.push(2);
    }

    return errors;
};

module.exports.validateRegister = async ({ email, username, password, userActions }) => {
    const errors = [];

    if (this.validateEmail(email) === false && email === undefined) {
        errors.push(1);
    }

    if (this.validateUsername(username) === false && username === undefined) {
        errors.push(2);
    }

    if (this.validatePassword(password) === false && password === undefined) {
        errors.push(3);
    }

    let user = await userActions.findUserByEmail(email);

    if (user) {
        errors.push(4);
    }

    user = await userActions.findUserByName(username);

    if (user) {
        errors.push(5);
    }

    return errors;
};

module.exports.validateAddItem = ({ title, description, rarity, type, power }) => {
    const errors = [];

    if (this.validateLength(title, 2, 30) === false) {
        errors.push(1);
    }

    if (description && description.length > 300) {
        errors.push(2);
    }

    if (rarity === undefined || rarityTypes[rarity.toUpperCase()] === undefined) {
        errors.push(3);
    }

    if (type === undefined || itemTypes[type.toUpperCase()] === undefined) {
        errors.push(4);
    }

    if (power === undefined || power < 0) {
        errors.push(5);
    }

    return errors;
};

module.exports.validateAddLevel = ({ number, power, duration, dropItems }) => {
    const errors = [];

    if (isNaN(number)) {
        errors.push(1)
    }

    if (isNaN(power)) {
        errors.push(2)
    }

    if (isNaN(duration)) {
        errors.push(3)
    }

    let chanceError = false;

    dropItems.forEach((item) => {
        if (isNaN(item.chance) || (item.chance < 0 || item.chance > 1)) {
            chanceError = true;
        }
    });

    if (chanceError) {
        errors.push(6);
    }

    return errors;
}

module.exports.validateEmail = (email) => {
    const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegExp.test(String(email).toLowerCase());
};

module.exports.validatePassword = (password) => {
    const passRegExp = /^(?=.*[a-z])(?=.*[A-Z]).{6,18}$/;
    return passRegExp.test(String(password));
};

module.exports.validateUsername = (username) => {
    if (username === undefined)
        return false;

    return this.validateLength(username, 4, 30);
};

module.exports.validateLength = (text, min, max) => {
    if (text === undefined)
        return false;

    return (text.length >= min && text.length <= max);
};