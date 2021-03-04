module.exports.success = (message) => {
    console.log('\x1b[32m%s\x1b[0m', `[Success] ${message}`);
};

module.exports.info = (message) => {
    console.info('\x1b[36m%s\x1b[0m', `[Info] ${message}`);
};

module.exports.warning = (message) => {
    console.warn('\x1b[33m%s\x1b[0m', `[Warning] ${message}`);
};

module.exports.errror = (message) => {
    console.error('\x1b[31m%s\x1b[0m', `[Warning] ${message}`);
};

module.exports.request = (req) => {
    console.log('\x1b[36m%s\x1b[0m', `[Request] ${req.method} ${req.path} (${req.ip === '::1' ? 'localhost' : req.ip})`);
};