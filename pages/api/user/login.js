const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { setCookie } = require("nookies");
const get = require("lodash.get");

const createConnection = require("../../../lib/db/connection");
const { User, Level } = require("../../../lib/db/models");

module.exports = async (req, res) => {
  await createConnection();
  const password = get(req, "body.password");
  const email = get(req, "body.email");
  if (password == null || email == null) {
    res.status(400).json({ error: "Heslo nebo e-mail nebyl vyplněn." });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res
      .status(401)
      .json({ error: true, attribute: "email", reason: "INVALID_EMAIL" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res
      .status(401)
      .json({ error: true, attribute: "password", reason: "INVALID_PASSWORD" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  setCookie({ res }, "token", token, {
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
    path: "/",
  });

  try {
    const level = await Level.findOne({ levelId: 1 })
      .populate({
        path: "users",
        match: { _id: { $eq: user.id } },
      })
      .exec();

    if (level.users.length == 0) {
      level.users.push(user._id);
      await level.save();
    }
  } catch (e) {
    console.error("Level error:", e);
  }

  res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
};
