const express = require('express');
const characterController = require('./../controllers/characters');

const router = express.Router();

router.patch('/items', characterController.equipItem);
router.patch('/pokemons', characterController.equipPokemon);

router.get('/', characterController.getCharacher);
router.post('/', characterController.createCharacter);

module.exports.init = (app, apiVersion, logger) => {
    app.use(`${apiVersion}/characters`, router);
    logger.success('Characters service loaded');
};