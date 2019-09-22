import React from "react";
import { useMappedState, useDispatch } from "redux-react-hook";
import Head from "next/head";

import { Services } from "../lib/with-services";
import Footer from "../components/footer";

export default function Global({ children }) {
  const services = React.useContext(Services);
  const dispatch = useDispatch();
  const mapState = React.useCallback(
    state => ({
      loggedIn: state.user.loggedIn,
      user: state.user
    }),
    []
  );
  const { loggedIn, user } = useMappedState(mapState);

  React.useEffect(() => {
    async function fetchData() {
      const { api } = services;
      const personalInfo = await api.get(api.normalizeUrl(`/api/user/me`));
      dispatch({ type: "USER:PERSONAL_INFO", personalInfo });
    }
    fetchData();
  });

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {children}

      {loggedIn ? <Footer /> : null}
    </>
  );
}
