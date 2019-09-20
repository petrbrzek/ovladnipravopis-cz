import ky from "ky-universal";
import Router from "next/router";
import { isServer } from "./utils";

export default class Api {
  _api = ky.extend({
    throwHttpErrors: false
  });

  _dispatcher = null;

  constructor({ dispatcher }) {
    this._dispatcher = dispatcher;
  }

  normalizeUrl(url, req) {
    const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";
    return `${baseUrl}${url}`;
  }

  get = async (url, options = {}) => {
    try {
      const response = await this._api(url, options);
      const json = await response?.json();
      if (response?.status === 403 && json?.reason == "USER_NOT_LOGGED_IN") {
        if (!isServer()) {
          Router.replace("/");
        }
        this._dispatcher({ type: "USER:LOG_OUT", loggedIn: false });
        return;
      }

      return json;
    } catch (e) {
      console.error("API get error:", e);
    }
  };

  post = this._api.post;
}
