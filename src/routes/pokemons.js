const express = require('express');
const pokemonsController = require('./../controllers/pokemons');

const router = express.Router();

router.get('/', pokemonsController.getPokemons);

router.post('/', pokemonsController.addPokemon);

module.exports.init = (app, apiVersion, logger) => {
    app.use(`${apiVersion}/pokemons`, router);
    logger.success('Pokemons service loaded');
};