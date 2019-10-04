import jwt from "jsonwebtoken";
import { parseCookies } from "nookies";

export function isUserLogged(ctx) {
  return Boolean(getUserId(ctx));
}

export function getUserId(ctx) {
  const cookies = parseCookies(ctx);
  const { token } = cookies;
  if (token) {
    const secret = process.env.APP_SECRET;
    const { userId } = jwt.verify(token, secret);
    return userId;
  }
  return null;
}

export function getHighestLevel(levels = []) {
  function compare(a, b) {
    const aLevelId = Number(a.levelId);
    const bLevelId = Number(b.levelId);

    if (aLevelId > bLevelId) {
      return -1;
    }
    if (aLevelId < bLevelId) {
      return 1;
    }
    return 0;
  }

  const [highest] = levels.sort(compare);

  return highest;
}
