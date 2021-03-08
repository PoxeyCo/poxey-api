const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: "Base item"
    },
    rarity: {
        type: Number,
        required: true,
        default: 0
    },
    type: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Item', itemSchema);