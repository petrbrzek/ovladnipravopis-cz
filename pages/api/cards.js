import { Exercise } from "../../lib/db/models";
import { isUserLogged } from "../../lib/user-utils";
import get from "lodash.get";

export default async (req, res) => {
  const loggedIn = isUserLogged({ req });
  if (!loggedIn) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }

  const id = get(req, "query.exerciseId");

  Exercise.findOne({ published: true, _id: { $eq: id } })
    .populate({
      path: "cards",
      select: "correct",
      match: { published: { $eq: true } }
    })
    .select("cards -_id")
    .exec((err, items) => {
      res.status(200).json(items.cards);
    });
};
