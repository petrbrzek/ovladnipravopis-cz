const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const get = require("lodash.get");
const crypto = require("crypto");

const createConnection = require("../../../lib/db/connection");
const User = require("../../../lib/db/models/user");

module.exports = async (req, res) => {
  await createConnection();
  const plainPassword = get(req, "body.password");
  const resetPasswordToken = get(req, "body.token");

  if (plainPassword == null || resetPasswordToken == null) {
    res.status(401).json({ error: "Heslo nebo token není vyplněno." });
    return;
  }

  if (plainPassword.length <= 4) {
    res.status(401).json({ error: "Heslo musí mít alespoň 5 znaků." });
    return;
  }

  const existingUser = await User.findOne({ resetPasswordToken });
  if (!existingUser) {
    res.status(401).json({ error: "Nenašli jsme váš uživatelský účet." });
    return;
  }

  if (
    existingUser.resetPasswordExpire &&
    existingUser.resetPasswordExpire < new Date().getTime()
  ) {
    res.status(401).json({ error: "Odkaz pro obnovu hesla expiroval." });
    return;
  }

  const uniqueId = crypto.randomBytes(64).toString("hex");
  const password = await bcrypt.hash(plainPassword, 10);

  existingUser.password = password;
  existingUser.resetPasswordExpire = new Date().getTime();
  existingUser.resetPasswordToken = uniqueId;

  await existingUser.save();
  const token = jwt.sign({ userId: existingUser.id }, process.env.APP_SECRET);

  res.status(200).json({
    token,
    user: {
      id: existingUser.id,
      email: existingUser.email,
    },
  });
};
