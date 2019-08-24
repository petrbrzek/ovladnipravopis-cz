const Photon = require("@generated/photon");
const { isUserLogged } = require("../lib/user-utils");

const photon = new Photon.default();

module.exports = async (req, res) => {
  const loggedIn = isUserLogged({ req });
  if (!loggedIn) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }
  const result = await photon.levels.findMany();
  res.status(200).json(result);
};
