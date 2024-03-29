const userActions = require('./../db/user/userActions');
const itemActions = require('./../db/item/itemActions');
const itemTypes = require('./../types/itemTypes');
const characterActions = require('./../db/character/characterActions');
const pokemonActions = require('./../db/pokemon/pokemonActions');

module.exports.getCharacher = async (req, res) => {
    if (req.isAuth === false) {
        return res.status(403).json({
            status: false,
            error: 'You must be logged in'
        });
    }

    const { id: userId } = req.userPayload;
    const user = await userActions.findUserById(userId);

    if (user === null) {
        return res.status(400).json({
            status: false,
            error: 'Can\'t found user with given id'
        });
    }

    if (user.characterId === null) {
        return res.status(200).json({
            status: true,
            character: {}
        });
    }

    const userCharacter = await characterActions.findCharacterById(user.characterId);

    if (userCharacter === null) {
        return res.status(404).json({
            status: false,
            error: 'Can\'t found character with given id'
        });
    }

    res.status(200).json({
        status: true,
        character: userCharacter
    });
};

module.exports.createCharacter = async (req, res) => {
    if (req.isAuth === false) {
        return res.status(403).json({
            status: false,
            error: 'You must be logged in'
        });
    }

    const { id: userId } = req.userPayload;
    const user = await userActions.findUserById(userId);

    if (user === null) {
        return res.status(400).json({
            status: false,
            error: 'Can\'t found user with given id'
        });
    }

    if (user.characterId) {
        return res.status(400).json({
            status: false,
            error: 'This user already has a character'
        });
    }

    const newCharacter = await characterActions.createCharacter(userId);

    user.set('characterId', newCharacter._id);
    await user.save();

    res.status(200).json({
        status: true,
        character: newCharacter
    });
};

module.exports.equipItem = async (req, res) => {
    if (req.isAuth === false) {
        return res.status(403).json({
            status: false,
            error: 'You must be logged in'
        });
    }

    const { itemId } = req.body;
    const { id: userId } = req.userPayload;

    const user = await userActions.findUserById(userId);
    const userCharacter = await characterActions.findCharacterById(user.characterId);

    if (userCharacter.items.includes(itemId) === false) {
        return res.status(400).json({
            status: false,
            errors: [1]
        });
    }

    const item = await itemActions.findItemById(itemId);

    if (item.type > 4) {
        return res.status(400).json({
            status: false,
            errors: [2]
        })
    }

    const prevItem = await itemActions.findItemById(userCharacter.selectedItems.helmet);

    userCharacter.power -= prevItem ? prevItem.power : 0;
    userCharacter.power += item.power;

    if (item.type === itemTypes.HELMET) {
        userCharacter.selectedItems.helmet = itemId;
    } else if (item.type === itemTypes.CHEST) {
        userCharacter.selectedItems.chest = itemId;
    } else if (item.type === itemTypes.BOOTS) {
        userCharacter.selectedItems.boots = itemId;
    } else if (item.type === itemTypes.WEAPON) {
        userCharacter.selectedItems.weapon = itemId;
    }

    await userCharacter.save();

    res.status(200).json({
        status: true,
        selectedItems: userCharacter.selectedItems,
        character: {
            power: userCharacter.power
        }
    });
};

module.exports.equipPokemon = async (req, res) => {
    if (req.isAuth === false) {
        return res.status(403).json({
            status: false,
            error: 'You must be logged in'
        });
    }

    const { pokemonId, pokemonPosition } = req.body;
    const { id: userId } = req.userPayload;

    const user = await userActions.findUserById(userId);
    const userCharacter = await characterActions.findCharacterById(user.characterId);

    if (isNaN(pokemonPosition) || pokemonPosition < 0 || pokemonPosition > 2) {
        return res.status(400).json({
            status: false,
            errors: [1]
        });
    }

    if (userCharacter.pokemons.includes(pokemonId) === false) {
        return res.status(400).json({
            status: false,
            errors: [2]
        });
    }

    const foundPokemon = Object.values(userCharacter.selectedPokemons).find((id) => String(id) === pokemonId);

    if (foundPokemon) {
        return res.status(400).json({
            status: false,
            errors: [3]
        });
    }

    const newPokemon = await pokemonActions.findPokemonById(pokemonId);
    const prevPokemon = await pokemonActions.findPokemonById(userCharacter.selectedPokemons[pokemonPosition]);

    userCharacter.power -= prevPokemon ? prevPokemon.power : 0;
    userCharacter.power += newPokemon.power;

    userCharacter.selectedPokemons[pokemonPosition] = pokemonId;

    await userCharacter.save();

    res.status(200).json({
        status: true,
        selectedPokemons: userCharacter.selectedPokemons,
        character: {
            power: userCharacter.power
        }
    });
};