const { getUserId } = require("../../../lib/user-utils");
const { destroyCookie } = require("nookies");

module.exports = async (req, res) => {
  const userId = getUserId({ req });

  if (!userId) {
    res.status(403).json({ error: true, reason: "USER_NOT_LOGGED_IN" });
    return;
  }

  destroyCookie({ res }, "token", {
    httpOnly: true,
    path: "/",
  });

  res.status(200).json({ message: "logout" });
};
