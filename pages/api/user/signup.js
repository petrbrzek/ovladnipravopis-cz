const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const get = require("lodash.get");

const User = require("../../../lib/db/models/user");

// TODO: move to env var
const APP_SECRET = "8vgQ490LcugL49F5nCujaKdnLzthr0jm";

module.exports = async (req, res) => {
  const plainPassword = get(req, "body.password");
  const email = get(req, "body.email");

  if (plainPassword == null || email == null) {
    res.status(401).json({ error: "Neither password nor email was provided" });
    return;
  }

  const existingUser = await User.find({ email });
  if (get(existingUser, "length")) {
    res.status(401).json({ error: "User with provided email already exists" });
    return;
  }

  const password = await bcrypt.hash(plainPassword, 10);
  const newUser = new User({
    email,
    password
  });
  const user = await newUser.save();

  res.status(200).json({
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user: {
      id: user.id,
      email: user.email
    }
  });
};
