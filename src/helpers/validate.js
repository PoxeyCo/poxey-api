module.exports.validateRegister = ({email, username, password}) => {
    const errors = [];

    if (this.validateEmail(email) === false) {
        errors.push(1);
    }

    if (this.validateUsername(username) === false) {
        errors.push(2);
    }

    if (this.validatePassword(password) === false) {
        errors.push(3);
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
    return this.validateLength(username, 4, 30);
};

module.exports.validateLength = (text, min, max) => {
    return (text.length >= min && text.length <= max);
};