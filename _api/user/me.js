const Photon = require("@generated/photon");
const { getUserId } = require("../../lib/user-utils");

const photon = new Photon.default();

module.exports = async (req, res) => {
  const userId = getUserId({ req });

  if (!userId) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }

  const result = await photon.users.findOne({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      updatedAt: true,
      levels: {
        select: {
          levelId: true,
          title: true,
          rank: true
        }
      }
    }
  });

  res.status(200).json(result);
};
