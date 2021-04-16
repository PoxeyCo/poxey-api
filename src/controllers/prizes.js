const userActions = require('./../db/user/userActions');
const characterActions = require('./../db/character/characterActions');
const prizesType = require('./../types/prizesTypes');

module.exports.getAllPosiblePrizes = async (req, res) => {
    res.status(200).json({
        status: true,
        prizes: prizesType
    });
};

module.exports.getNextPrize = async (req, res) => {
    if (req.isAuth === false) {
        return res.status(403).json({
            status: false,
            error: 'You must be logged in'
        });
    }

    const { id: userId } = req.userPayload;
    const foundUser = await userActions.findUserById(userId);

    const millisecondDelta = (Date.now() - foundUser.dailyRewardLastTaken);
    const prize = prizesType[foundUser.dailyRewardDaysInRow];
    const isCanTakeReward = foundUser.dailyRewardLastTaken === null ? true : millisecondDelta > 86400000;


    res.status(200).json({
        status: true,
        prize,
        isCanTakeReward,
        millisecondsLeft: millisecondDelta > 86400000 ? null : millisecondDelta
    });
};

module.exports.getPrize = async (req, res) => {
    if (req.isAuth === false) {
        return res.status(403).json({
            status: false,
            error: 'You must be logged in'
        });
    }

    const { id: userId } = req.userPayload;
    const foundUser = await userActions.findUserById(userId);
    const character = await characterActions.findCharacterById(foundUser.characterId);

    const isCanTakeReward = foundUser.dailyRewardLastTaken === null ? true : (Date.now() - foundUser.dailyRewardLastTaken) > 86400000;

    if (isCanTakeReward === false) {
        return res.status(400).json({
            status: false,
            error: 'You can\'t take prize yet'
        });
    }

    const prize = prizesType[foundUser.dailyRewardDaysInRow];

    if (prize.type === 'stats') {
        foundUser.addCash(prize.value.cash);
        foundUser.addExperience(prize.value.experience);
    }
    else if (prize.type === 'pokemon') {
        character.pokemons.push(prize.value.pokemonId);
    }
    else if (prize.type === 'item') {
        character.items.push(prize.value.itemId);
    }

    foundUser.dailyRewardLastTaken = Date.now();
    foundUser.dailyRewardDaysInRow = foundUser.dailyRewardDaysInRow === 6 ? 0 : foundUser.dailyRewardDaysInRow + 1;

    await foundUser.save();
    await character.save();

    res.status(200).json({
        status: true,
        prize
    });
};