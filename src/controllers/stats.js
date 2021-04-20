const itemActions = require('./../db/item/itemActions');
const levelActions = require('./../db/level/levelActions');
const userActions = require('./../db/user/userActions');
const pokemonActions = require('./../db/pokemon/pokemonActions');

module.exports.getCounts = async (req, res) => {
    const itemCounts = (await itemActions.getAllItems()).length;
    const levelCounts = (await levelActions.getAllLevels()).length;
    const userCounts = (await userActions.getAllUsers()).length;
    const pokemonCounts = (await pokemonActions.getAllPokemons()).length;

    return res.status(200).json({
        status: true,
        counts: {
            items: itemCounts,
            levels: levelCounts,
            users: userCounts,
            pokemos: pokemonCounts
        }
    });
};