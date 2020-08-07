const { getUserId } = require("../../../lib/user-utils");
const get = require("lodash.get");

const createConnection = require("../../../lib/db/connection");
const { Exercise, Level } = require("../../../lib/db/models");

module.exports = async (req, res) => {
  await createConnection();
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

  const exercise = await Exercise.findOne({ _id: exerciseId })
    .populate({
      path: "users",
      match: { _id: { $eq: userId } },
    })
    .exec();

  if (exercise.users.length == 0) {
    exercise.users.push(userId);
    await exercise.save();
  }

  const level = await Level.findOne()
    .where("exercises")
    .in([exerciseId])
    .exec();

  const levelExercises = await Level.findOne({ _id: level.id })
    .populate("exercises")
    .exec();

  const userExercises = await Exercise.find()
    .where("users")
    .in([userId])
    .exec();

  const finishedLevel = levelExercises.exercises.every((exercise) => {
    return userExercises.find((value) => {
      return value.id === exercise.id;
    });
  });

  const nextLevel = await Level.findOne({
    levelId: String(Number(levelExercises.levelId) + 1),
  });

  if (finishedLevel && nextLevel) {
    const level = await Level.findOne({
      levelId: String(Number(levelExercises.levelId) + 1),
    })
      .populate({
        path: "users",
        match: { _id: { $eq: userId } },
      })
      .exec();

    if (level.users.length == 0) {
      level.users.push(userId);
      await level.save();
    }
  }

  res.status(200).end();
};
