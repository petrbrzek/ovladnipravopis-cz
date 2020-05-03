import React from "react";

import { isServer } from "./utils";
import { isUserLogged } from "./user-utils";

export default (App) => {
  return class AppWithUser extends React.Component {
    static async getInitialProps(appContext) {
      const { ctx } = appContext;
      let loggedIn;

      if (isServer()) {
        loggedIn = isUserLogged(ctx);
        ctx.reduxStore.dispatch({ type: "USER:LOGGED_IN", loggedIn });

        // Redirect to homepage when not logged in
        // allow /api/ endpoint
        // TODO: remove this as it does not work with usePublicPage,
        // it's duplicated and even not responsible for this.
        // Refactor /settings, /exercise/[id] files, so it doesn't crash for non logged user
        if (
          !loggedIn &&
          ctx.pathname !== "/" &&
          ctx.pathname !== "/signup" &&
          ctx.pathname !== "/forget-password" &&
          ctx.pathname !== "/reset-password" &&
          !ctx.pathname.includes("/api/")
        ) {
          ctx.res.writeHead(302, {
            Location: "/",
          });
          ctx.res.end();
          return {};
        }

        appContext.ctx.loggedIn = loggedIn;

        if (loggedIn) {
          const options = {
            headers: {
              cookie: ctx.req?.headers?.cookie,
            },
          };
          const personalInfo = await ctx.services.api.get(
            ctx.services.api.normalizeUrl(`/api/user/me`, ctx.req),
            options
          );
          ctx.reduxStore.dispatch({ type: "USER:PERSONAL_INFO", personalInfo });
        }
      }

      let appProps = {};
      if (typeof App.getInitialProps === "function") {
        appProps = await App.getInitialProps(appContext);
      }

      return { ...appProps, ...(isServer() && loggedIn) };
    }

    render() {
      return <App {...this.props} />;
    }
  };
};
