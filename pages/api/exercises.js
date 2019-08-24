import { Exercise, Level } from "../../lib/db/models";
import { getUserId } from "../../lib/user-utils";

export default async (req, res) => {
  const levelId = `${req.query.level || 1}`;
  const userId = getUserId({ req });

  if (!userId) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }

  const levelsByUser = await Level.find()
    .where("users")
    .ne()
    .populate({
      path: "users",
      match: { _id: { $eq: userId } }
    })
    .exec();

  const userLevels = [...levelsByUser, { levelId: 1 }];
  const canSee = userLevels.find(level => level.levelId == levelId);

  if (!canSee) {
    res.status(403).json({ error: true, reason: "LEVEL_LOCKED" });
    return;
  }

  let levelExercises = {};
  try {
    levelExercises = await Level.findOne({ levelId: levelId })
      .populate({
        path: "exercises",
        select: "_id title content",
        populate: [
          {
            path: "cards",
            match: { published: { $eq: true } },
            select: "content _id exercises"
          },
          {
            path: "users",
            match: { _id: { $eq: userId } },
            select: "_id"
          }
        ]
      })
      .populate({
        path: "users",
        match: { _id: { $eq: userId } },
        select: "_id"
      })
      .select("_id title levelId rank users")
      .exec();
  } catch (e) {
    console.error("Error: ", e);
  }

  res.status(200).json(levelExercises);
};
