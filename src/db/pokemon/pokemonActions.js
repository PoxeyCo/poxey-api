const Pokemon = require('./pokemonModel');

module.exports.getAllPokemons = async () => {
    try {
        const pokemons = await Pokemon.find();
        return pokemons;
    } catch (e) {
        logger.error('Error with getting all pokemons');
        return null;
    }
};

module.exports.findPokemonById = async (id) => {
    try {
        const foundPokemon = await Pokemon.findOne({ _id: id });
        return foundPokemon;
    } catch (e) {
        return null;
    }
};

module.exports.addPokemon = async ({ pokemonId, name, sprite, type, stats }) => {
    const power = Object.values(stats).reduce((v, a) => v + a) / 4;

    const pokemon = new Pokemon({
        pokemonId,
        name,
        sprite,
        type,
        stats,
        power
    });

    await pokemon.save();

    return Object.freeze(pokemon);
};