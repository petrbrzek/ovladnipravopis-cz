const { getUserId } = require("../../../lib/user-utils");

const createConnection = require("../../../lib/db/connection");
const User = require("../../../lib/db/models/user");
const Level = require("../../../lib/db/models/level");

module.exports = async (req, res) => {
  await createConnection();
  const userId = getUserId({ req });

  if (!userId) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }

  const user = await User.findOne({ _id: userId }).select("_id email");
  const levels = await Level.find()
    .where("users")
    .in([userId])
    .select("levelId rank updatedAt -_id")
    .exec();

  res.status(200).json({ user, levels });
};
