const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: false,
        default: 1
    },
    experience: {
        type: Number,
        required: false,
        default: 0
    },
    expToNextLevel: {
        type: Number,
        required: false,
        default: 100
    },
    cash: {
        type: Number,
        required: true
    },
    avatarId: {
        type: Number,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    isBanned: {
        type: Boolean,
        required: false,
        default: false
    },
    banOver: {
        type: Date,
        required: false,
        default: null
    },
    isMutted: {
        type: Boolean,
        required: false,
        default: false
    },
    muteOver: {
        type: Date,
        required: false,
        default: null
    },
    registeredOn: {
        type: Date,
        required: false,
        default: Date.now
    },
    characterId: {
        type: mongoose.ObjectId,
        required: false,
        default: null
    },
    dailyRewardLastTaken: {
        type: Date,
        required: false,
        default: null
    },
    dailyRewardDaysInRow: {
        type: Number,
        required: false,
        default: 0
    },
    friends: {
        type: Array,
        required: false,
        default: []
    },
});

userSchema.methods.addCash = function (cash) {
    this.cash += cash;
}

userSchema.methods.addExperience = function (exp) {
    this.experience += exp;

    if (this.experience > this.expToNextLevel) {
        this.level += 1;
        this.experience %= this.expToNextLevel;
        this.expToNextLevel = this.level * 100;
    }
}

module.exports = mongoose.model('User', userSchema);