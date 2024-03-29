const mongoose = require('mongoose');

const adventureSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    characterId: {
        type: mongoose.ObjectId,
        required: true
    },
    levelId: {
        type: mongoose.ObjectId,
        required: true
    },
    startTime: {
        type: Date,
        required: false,
        default: Date.now
    },
    endTime: {
        type: Date,
        required: true
    },
    isCompleted: {
        type: Boolean,
        required: false,
        default: false
    },
    isSuccesful: {
        type: Boolean,
        required: false,
        default: false
    },
    droppedItems: {
        type: Array,
        required: false,
        default: []
    }
});

module.exports = mongoose.model('Adventure', adventureSchema);