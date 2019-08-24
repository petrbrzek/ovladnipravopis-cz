const Photon = require("@generated/photon");
const { getUserId } = require("../lib/user-utils");

const photon = new Photon.default();

module.exports = async (req, res) => {
  const levelId = `${req.query.level || 1}`;
  const userId = getUserId({ req });

  if (!userId) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }

  const user = await photon.users.findOne({
    where: { id: userId },
    include: {
      levels: true
    }
  });

  // Level 1 is alwats available
  const userLevels = [...user.levels, { levelId: 1 }];
  const canSee = userLevels.find(level => level.levelId == levelId);

  if (!canSee) {
    res.status(403).json({ error: true, reason: "LEVEL_LOCKED" });
    return;
  }

  const result = await photon.exercises.findMany({
    where: { level: { levelId } },
    include: {
      users: {
        first: 1,
        select: {
          id: true
        },
        where: {
          id: userId
        }
      }
    }
  });

  res.status(200).json(result);
};
