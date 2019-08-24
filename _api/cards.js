const Photon = require("@generated/photon");
const { isUserLogged } = require("../lib/user-utils");
const get = require("lodash.get");

const photon = new Photon.default();

module.exports = async (req, res) => {
  const loggedIn = isUserLogged({ req });
  if (!loggedIn) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }

  const id = get(req, "query.exerciseId");

  const result = await photon.cards.findMany({
    where: {
      exercise: {
        id
      },
      published: true
    },
    select: {
      id: true,
      correct: true
    }
  });
  res.status(200).json(result);
};
