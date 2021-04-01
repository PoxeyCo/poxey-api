const userActions = require('./../db/user/userActions');
const prizesType = require('./../types/prizesTypes');

module.exports.getPrize = async (req, res) => {
    if (req.isAuth === false) {
        return res.status(403).json({
            status: false,
            error: 'You must be logged in'
        });
    }

    const { id: userId } = req.userPayload;
    const foundUser = await userActions.findUserById(userId);

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

    foundUser.dailyRewardLastTaken = Date.now();
    foundUser.dailyRewardDaysInRow = foundUser.dailyRewardDaysInRow === 6 ? 0 : foundUser.dailyRewardDaysInRow + 1;

    await foundUser.save();

    res.send('hello');
};