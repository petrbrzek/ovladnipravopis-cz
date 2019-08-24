const Photon = require("@generated/photon");
const { getUserId } = require("../../lib/user-utils");
const get = require("lodash.get");

const photon = new Photon.default();

module.exports = async (req, res) => {
  const userId = getUserId({ req });
  if (!userId) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }

  const exerciseId = get(req, "body.exerciseId");

  if (!exerciseId) {
    res.status(400);
    res.end();
    return;
  }

  await photon.users.update({
    where: {
      id: userId
    },
    data: {
      exercises: {
        connect: {
          id: exerciseId
        }
      }
    }
  });

  const exercise = await photon.exercises.findOne({
    where: {
      id: exerciseId
    },
    include: {
      level: {
        select: {
          id: true
        }
      }
    }
  });

  const levelExercises = await photon.levels.findOne({
    where: {
      id: exercise.level.id
    },
    include: {
      exercises: {
        select: {
          id: true
        }
      }
    }
  });

  const userExercises = await photon.users.findOne({
    where: {
      id: userId
    },
    include: {
      exercises: {
        select: {
          id: true
        }
      }
    }
  });

  const finishedLevel = levelExercises.exercises.every(exercise => {
    return userExercises.exercises.find(value => {
      return value.id === exercise.id;
    });
  });

  let nextLevel;
  try {
    nextLevel = await photon.levels.findOne({
      where: {
        levelId: String(Number(levelExercises.levelId) + 1)
      }
    });
  } catch (e) {}

  if (finishedLevel && nextLevel) {
    await photon.users.update({
      where: {
        id: userId
      },
      data: {
        levels: {
          connect: {
            levelId: String(Number(levelExercises.levelId) + 1)
          }
        }
      }
    });
  }

  res.status(200).end();
};
