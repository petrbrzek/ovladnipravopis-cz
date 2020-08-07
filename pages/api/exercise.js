import { Exercise, Level } from "../../lib/db/models";
import { isUserLogged } from "../../lib/user-utils";
import get from "lodash.get";
import createConnection from "../../lib/db/connection";

export default async (req, res) => {
  await createConnection();
  const loggedIn = isUserLogged({ req });
  if (!loggedIn) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }

  const id = get(req, "query.id");

  const level = await Level.findOne()
    .populate({
      path: "exercises",
      match: { _id: { $eq: id } },
    })
    .select("title levelId -exercises")
    .exec();

  const exercise = await Exercise.findOne({ published: true, _id: { $eq: id } })
    .populate({
      path: "cards",
      select: "id content",
      match: { published: { $eq: true } },
    })
    .populate({
      path: "level",
      select: "id levelId",
    })
    .select("-published -users -__v -createdAt -updatedAt")
    .exec();

  res.status(200).json({
    _id: exercise._id,
    title: exercise.title,
    content: exercise.content,
    cards: exercise.cards,
    level,
  });
};
