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

  const id = get(req, "query.id");

  const result = await photon.exercises.findOne({
    where: {
      id
    },
    include: {
      cards: {
        where: {
          published: true
        },
        select: {
          id: true,
          content: true
        }
      },
      level: {
        select: {
          id: true,
          levelId: true
        }
      }
    }
  });

  res.status(200).json(result);
};
