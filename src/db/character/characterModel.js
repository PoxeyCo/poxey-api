const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    items: {
        type: Array,
        required: false,
        default: []
    },
    pokemons: {
        type: Array,
        required: false,
        default: []
    },
    lastLevelCompleted: {
        type: Number,
        required: false,
        default: 0
    },
    selectedPokemons: {
        0: {
            type: mongoose.ObjectId,
            required: false,
            default: null
        },
        1: {
            type: mongoose.ObjectId,
            required: false,
            default: null
        },
        2: {
            type: mongoose.ObjectId,
            required: false,
            default: null
        }
    },
    selectedItems: {
        helmet: {
            type: mongoose.ObjectId,
            required: false,
            default: null
        },
        chest: {
            type: mongoose.ObjectId,
            required: false,
            default: null
        },
        boots: {
            type: mongoose.ObjectId,
            required: false,
            default: null
        },
        weapon: {
            type: mongoose.ObjectId,
            required: false,
            default: null
        }
    },
    power: {
        type: Number,
        required: false,
        default: 0
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now
    }
});

module.exports = mongoose.model('Character', characterSchema);