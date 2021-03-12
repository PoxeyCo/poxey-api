const mongoose = require('mongoose');

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
    return (text.length >= min && text.length <= max);
};