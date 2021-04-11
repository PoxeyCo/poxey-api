const pokemonActions = require('./../db/pokemon/pokemonActions');
const characterActions = require('./../db/character/characterActions');

module.exports.getPokemons = async (req, res) => {
    let { page, limit } = req.query;

    if (isNaN(page) || page === undefined) {
        page = 1;
    }

    if (isNaN(limit) || limit === undefined) {
        limit = 10;
    }

    page = Number(page);
    limit = Number(limit);

    try {
        const pokemons = await pokemonActions.getAllPokemons();

        res.status(200).json({
            status: true,
            totalCount: pokemons.length,
            totalPages: Math.ceil(pokemons.length / limit),
            pokemons: pokemons.slice(limit * (page - 1), limit * page)
        });
    } catch (err) {
        logger.error('Problem with getting all pokemons');

        res.status(500).json({
            status: false,
            error: 'Can not get all pokemons'
        });
    }
};

module.exports.addPokemon = async (req, res) => {
    const createdPokemon = await pokemonActions.addPokemon(req.body);

    res.status(201).json({
        status: true,
        pokemon: createdPokemon
    });
};

module.exports.getCharacterPokemons = async (req, res) => {
    const { id } = req.query;

    if (id === undefined) {
        return res.status(400).json({
            status: false,
            error: 'You have to send id in query'
        });
    }

    const foundCharacter = await characterActions.findCharacterById(id);

    if (foundCharacter === null) {
        return res.status(400).json({
            status: false,
            error: 'Character with this id does not exist'
        });
    }

    const characterPokemons = foundCharacter.pokemons;
    const parsedPokemons = [];

    if (characterPokemons.length === 0) {
        return res.status(200).json({
            status: true,
            pokemons: []
        });
    }

    characterPokemons.forEach(async (pokemonId) => {
        const parsedPokemon = await pokemonActions.findPokemonById(pokemonId);
        parsedPokemons.push(parsedPokemon);

        if (parsedPokemons.length === characterPokemons.length) {
            res.status(200).json({
                status: true,
                pokemons: parsedPokemons
            });
        }
    });
};