const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    level: {
        type: Number,
        required: false,
        default: 1
    },
    expToNextLevel: {
        type: Number,
        required: false,
        default: 100
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
    createdAt: {
        type: Date,
        required: false,
        default: Date.now
    }
});

module.exports = mongoose.model('Character', characterSchema);