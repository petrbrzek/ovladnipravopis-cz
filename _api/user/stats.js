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
  const cardId = get(req, "body.cardId");
  const state = get(req, "body.state");

  if (!exerciseId || !state) {
    res.status(400);
    res.end();
    return;
  }

  await photon.userStats.create({
    data: {
      state,
      user: {
        connect: {
          id: userId
        }
      },
      exercise: {
        connect: {
          id: exerciseId
        }
      },

      ...(cardId && {
        card: {
          connect: {
            id: cardId
          }
        }
      })
    }
  });

  res.status(200).end();
};
