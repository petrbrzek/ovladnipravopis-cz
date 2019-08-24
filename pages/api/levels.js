import { Level } from "../../lib/db/models";
import { isUserLogged } from "../../lib/user-utils";

export default async (req, res) => {
  const loggedIn = isUserLogged({ req });
  if (!loggedIn) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }

  Level.find().exec((err, items) => {
    res.status(200).json(items);
  });
};
