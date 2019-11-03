const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const get = require("lodash.get");

const User = require("../../../lib/db/models/user");

module.exports = async (req, res) => {
  const plainPassword = get(req, "body.password");
  const email = get(req, "body.email");

  if (plainPassword == null || email == null) {
    res.status(401).json({ error: "Heslo nebo e-mail nebyl vyplněn." });
    return;
  }

  if (plainPassword.length <= 4) {
    res.status(401).json({ error: "Heslo musí mít alespoň 5 znaků." });
    return;
  }

  const existingUser = await User.find({ email });
  if (get(existingUser, "length")) {
    res.status(401).json({ error: "Tento e-mail už je zaregistrovaný." });
    return;
  }

  const password = await bcrypt.hash(plainPassword, 10);
  const newUser = new User({
    email,
    password
  });
  const user = await newUser.save();
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email
    }
  });
};
