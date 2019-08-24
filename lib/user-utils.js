import jwt from "jsonwebtoken";
import { parseCookies } from "nookies";

// TODO: move to env var
const APP_SECRET = "8vgQ490LcugL49F5nCujaKdnLzthr0jm";

export function isUserLogged(ctx) {
  return Boolean(getUserId(ctx));
}

export function getUserId(ctx) {
  const cookies = parseCookies(ctx);
  const { token } = cookies;
  if (token) {
    const secret = APP_SECRET;
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
