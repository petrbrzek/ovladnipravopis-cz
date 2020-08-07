const { getUserId } = require("../../../lib/user-utils");
const get = require("lodash.get");

const createConnection = require("../../../lib/db/connection");
const { UserStats } = require("../../../lib/db/models");

module.exports = async (req, res) => {
  await createConnection();
  const userId = getUserId({ req });
  if (!userId) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }

  const exerciseId = get(req, "body.exerciseId");
  const cardId = get(req, "body.cardId");
  const state = get(req, "body.state");

  if (!exerciseId || !state) {
    res.status(400);
    res.end();
    return;
  }

  const userStats = new UserStats({
    user: { _id: userId },
    exercise: { _id: exerciseId },
    ...(cardId && { card: { _id: cardId } }),
    state,
  });
  await userStats.save();

  res.status(200).end();
};
