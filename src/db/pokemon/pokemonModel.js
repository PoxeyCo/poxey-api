const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
    pokemonId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sprite: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    stats: {
        hp: {
            type: Number,
            required: true
        },
        attack: {
            type: Number,
            required: true
        },
        defense: {
            type: Number,
            required: true
        },
        speed: {
            type: Number,
            required: true
        }
    },
    power: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Pokemon', pokemonSchema);