const Recovery = require('./recoveryModel');

module.exports.findRecoveryEntityByEmail = async (email) => {
    try {
        const recoveryPokemon = await Recovery.findOne({ email: email });
        return recoveryPokemon;
    } catch (e) {
        return null;
    }
};

module.exports.addRecoveryEntity = async ({ email, code }) => {
    const recoveryEntity = new Recovery({
        email,
        code
    });

    await recoveryEntity.save();

    return Object.freeze(recoveryEntity);
};