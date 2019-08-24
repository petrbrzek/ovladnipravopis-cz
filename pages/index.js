import React from "react";
import { useMappedState, StoreContext } from "redux-react-hook";
import { useRouter } from "next/router";

import { isServer } from "../lib/utils";
import { Header } from "../components/header";
import Content from "../components/content";
import PublicHomepage from "../components/public-homepage";
import { Services } from "../lib/with-services";

export default function Index() {
  const reduxStore = React.useContext(StoreContext);
  const services = React.useContext(Services);
  const router = useRouter();
  const mapState = React.useCallback(
    state => ({
      loggedIn: state.user.loggedIn
    }),
    []
  );
  const { loggedIn } = useMappedState(mapState);

  React.useEffect(() => {
    getUserData({
      query: router.query,
      reduxStore,
      services
    });
  }, [router.asPath, loggedIn]);

  return (
    <div className="flex flex-col flex-1">
      {loggedIn ? (
        <>
          <Header />
          <Content />
        </>
      ) : (
        <PublicHomepage />
      )}
    </div>
  );
}

Index.getInitialProps = async ctx => {
  if (isServer()) {
    const state = ctx.reduxStore.getState();
    if (state.user.loggedIn) {
      await getUserData(ctx);
    }
  }

  return {};
};

async function getUserData({ query, req, reduxStore, services: { api } }) {
  const level = query?.level || 1;
  const options = {
    headers: {
      cookie: req?.headers?.cookie
    }
  };

  const [levels, exercises] = await Promise.all([
    api.get(`${process.env.API_ENDPOINT}/api/levels`, options),
    api.get(`${process.env.API_ENDPOINT}/api/exercises?level=${level}`, options)
  ]);

  if (exercises?.error && exercises?.reason === "LEVEL_LOCKED") {
    reduxStore.dispatch({ type: "LEVEL_LOCKED", level });
  }

  if (!exercises?.error) {
    reduxStore.dispatch({ type: "ADD_EXERCISES", level, exercises });
  }

  reduxStore.dispatch({ type: "ADD_LEVELS", levels });
}
