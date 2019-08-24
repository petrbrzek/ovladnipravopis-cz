const { getUserId } = require("../../../lib/user-utils");

const User = require("../../../lib/db/models/user");
const Level = require("../../../lib/db/models/level");

module.exports = async (req, res) => {
  const userId = getUserId({ req });

  if (!userId) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }

  const user = await User.findOne({ _id: userId }).select("_id email");
  const levels = await Level.find()
    .where("users")
    .ne([])
    .populate({
      path: "users",
      match: { _id: { $eq: userId } },
      select: "_id"
    })
    .select("levelId rank -_id -users")
    .exec();

  res.status(200).json({ user, levels });
};
