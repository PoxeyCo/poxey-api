const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    dropItems: {
        type: Array,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Level', levelSchema);