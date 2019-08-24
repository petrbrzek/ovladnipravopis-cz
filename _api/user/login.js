const Photon = require("@generated/photon");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { setCookie } = require("nookies");
const get = require("lodash.get");

const photon = new Photon.default();

// TODO: move to env var
const APP_SECRET = "8vgQ490LcugL49F5nCujaKdnLzthr0jm";

module.exports = async (req, res) => {
  const password = get(req, "body.password");
  const email = get(req, "body.email");
  if (password == null || email == null) {
    res.status(400).json({ error: "Neither password nor email was provided" });
    return;
  }

  let user;
  try {
    user = await photon.users.findOne({
      where: {
        email
      },
      include: {
        levels: {
          select: {
            levelId: true,
            title: true,
            rank: true
          }
        }
      }
    });
  } catch (e) {
    console.error("login: find user by email: ", e);
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

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  setCookie({ res }, "token", token, {
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
    path: "/"
  });

  // Probably bug of Prisma 2 as update will always create a new item
  const firstLevelExists = user.levels.find(level => level.levelId == "1");
  if (!firstLevelExists) {
    await photon.users.update({
      where: {
        id: user.id
      },
      data: {
        levels: {
          connect: {
            levelId: String(1)
          }
        }
      }
    });
  }

  res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email
    }
  });
};
