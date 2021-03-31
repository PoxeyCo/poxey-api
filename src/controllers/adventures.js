const userActions = require('./../db/user/userActions');
const characterActions = require('./../db/character/characterActions');
const levelActions = require('./../db/level/levelActions');
const adventureActions = require('./../db/adventure/adventureActions');

const calculateAdventureResults = async (adventure, character, level) => {
    const chanceToPass = character.power / level.power;
    const diceRoll = Math.random();

    if (diceRoll <= chanceToPass) {
        const droppedItems = [];
        level.dropItems.forEach((item) => {
            const diceRollItem = Math.random();

            if (diceRollItem <= item.chance) {
                droppedItems.push(item.itemId);
            }
        });

        adventure.set('droppedItems', droppedItems);
    }

    adventure.set('isCompleted', true);
    adventure.set('isSuccesful', diceRoll <= chanceToPass);
    adventure.save();
};

module.exports.syncAdventures = async () => {
    const allAdventures = await adventureActions.getAllAdventures();

    allAdventures.forEach(async (a) => {
        if (a.isCompleted === false) {
            const character = await characterActions.findCharacterById(a.characterId);
            const level = await levelActions.findLevelById(a.levelId);

            const delta = new Date(a.endTime) - Date.now();

            setTimeout(() => {
                calculateAdventureResults(a, character, level);
            }, delta);
        }
    });
};

module.exports.startAdventure = async (req, res) => {
    if (req.isAuth === false) {
        return res.status(403).json({
            status: false,
            error: 'You must be logged in'
        });
    }

    const { id: userId } = req.userPayload;
    const user = await userActions.findUserById(userId);

    if (user.characterId === null) {
        return res.status(400).json({
            status: false,
            error: 'This user havn\'t a character'
        });
    }

    const { levelId } = req.body;

    const level = await levelActions.findLevelById(levelId);

    if (level === null) {
        return res.status(400).json({
            status: false,
            error: 'Can\'t find level with this id'
        });
    }

    const character = await characterActions.findCharacterById(user.characterId);

    if (level.number - character.lastLevelCompleted > 1) {
        return res.status(400).json({
            status: false,
            errors: [1]
        });
    }

    let adventure = await adventureActions.findAdventureByUserId(user._id);

    if (adventure !== null) {
        return res.status(400).json({
            status: false,
            errors: [2]
        });
    }

    adventure = await adventureActions.addAdventure({
        userId,
        levelId: level._id,
        characterId: character._id
    });

    setTimeout(async () => {
        calculateAdventureResults(adventure, character, level);
    }, level.duration);

    res.status(201).json({
        status: true,
        adventure
    });
};

module.exports.getAdventure = async (req, res) => {
    if (req.isAuth === false) {
        return res.status(403).json({
            status: false,
            error: 'You must be logged in'
        });
    }

    const { id: userId } = req.userPayload;

    const foundAdventure = await adventureActions.findAdventureByUserId(userId);

    return res.status(200).json({
        status: true,
        adventure: foundAdventure
    });
};

module.exports.completeAdventure = async (req, res) => {
    if (req.isAuth === false) {
        return res.status(403).json({
            status: false,
            error: 'You must be logged in'
        });
    }

    const { id } = req.params;
    const { id: userId } = req.userPayload;

    const foundUser = await userActions.findUserById(userId);
    const foundAdventure = await adventureActions.findCompletedAdventure(id);

    if (foundAdventure === null) {
        return res.status(400).json({
            status: false,
            errors: [1]
        });
    }

    const character = await characterActions.findCharacterById(foundAdventure.characterId);
    const level = await levelActions.findLevelById(foundAdventure.levelId);

    if (foundAdventure.isSuccesful) {
        character.set('lastLevelCompleted', level.number);
        foundUser.cash += (level.number * level.power) / 3;
        foundUser.experience += Math.ceil((level.number * level.power) / 2);

        if (foundUser.experience > foundUser.expToNextLevel) {
            foundUser.level += 1;
            foundUser.experience %= foundUser.expToNextLevel;
            foundUser.expToNextLevel = foundUser.level * 100;
        }

        const items = character.items;
        character.set('items', items.concat(foundAdventure.droppedItems));
    }

    await foundUser.save();
    await character.save();
    await foundAdventure.deleteOne();

    res.status(200).json({
        status: true,
        completedAdventure: {
            isSuccesful: foundAdventure.isSuccesful,
            droppedItems: foundAdventure.droppedItems,
            user: {
                cash: foundUser.cash,
                experience: foundUser.experience,
                expToNextLevel: foundUser.expToNextLevel,
                level: foundUser.level
            }
        }
    });
};