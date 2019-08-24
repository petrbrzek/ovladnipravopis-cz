const Photon = require("@generated/photon");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const get = require("lodash.get");

const photon = new Photon.default();

// TODO: move to env var
const APP_SECRET = "8vgQ490LcugL49F5nCujaKdnLzthr0jm";

module.exports = async (req, res) => {
  const plainPassword = get(req, "body.password");
  const email = get(req, "body.email");

  if (plainPassword == null || email == null) {
    res.status(401).json({ error: "Neither password nor email was provided" });
    return;
  }

  let existingUser;

  // Photon will throw an error if the database is empty
  try {
    existingUser = await photon.users.findOne({ where: { email } });
  } catch {}
  if (existingUser) {
    res.status(401).json({ error: "User with provided email already exists" });
    return;
  }

  const password = await bcrypt.hash(plainPassword, 10);
  const user = await photon.users.create({
    data: {
      email,
      password
    }
  });

  res.status(200).json({
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user: {
      id: user.id,
      email: user.email
    }
  });
};
