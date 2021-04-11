const mongoose = require('mongoose');

const recoverySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true
    },
    isCodeChecked: {
        type: Boolean,
        required: false,
        default: false
    }
});

module.exports = mongoose.model('Recovery', recoverySchema);