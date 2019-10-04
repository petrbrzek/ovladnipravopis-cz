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
      user: state.user,
      levels: state.levels
    }),
    []
  );
  const { loggedIn, user, levels } = useMappedState(mapState);

  let lastLevel = [];
  if (Array.isArray(levels)) {
    lastLevel = levels[levels.length - 1];
  }

  React.useEffect(() => {
    async function fetchData() {
      const { api } = services;
      const personalInfo = await api.get(api.normalizeUrl(`/api/user/me`));
      dispatch({ type: "USER:PERSONAL_INFO", personalInfo });
    }
    fetchData();
  }, [user.updatedAt, loggedIn, lastLevel?.updatedAt]);

  return (
    <>
      <Head>
        <title>Ovládni pravopis.cz</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/static/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/static/favicons/favicon-emoji.png"
        />

        <meta name="apple-mobile-web-app-title" content="🦊 Ovládni pravopis" />
        <meta name="application-name" content="🦊 Ovládni pravopis" />

        <meta name="description" content="Pravopis dokáže člověka dost potrápit, nezvládnutý pravopis dokonce ztrapnit. Říká se ale, těžko na cvičišti, lehko na bojišti. Aplikace Ovládni pravopis je prostorem pro trénink." />
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="🦊 Ovládni pravopis" />
        <meta property="og:title" content="Pravopis dokáže člověka dost potrápit, nezvládnutý pravopis dokonce ztrapnit. Říká se ale, těžko na cvičišti, lehko na bojišti. Aplikace Ovládni pravopis je prostorem pro trénink." />
        <meta property="og:description" content="Pravopis dokáže člověka dost potrápit, nezvládnutý pravopis dokonce ztrapnit. Říká se ale, těžko na cvičišti, lehko na bojišti. Aplikace Ovládni pravopis je prostorem pro trénink." />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="🦊 Ovládni pravopis" />
        <meta name="twitter:description" content="Pravopis dokáže člověka dost potrápit, nezvládnutý pravopis dokonce ztrapnit. Říká se ale, těžko na cvičišti, lehko na bojišti. Aplikace Ovládni pravopis je prostorem pro trénink."/>
      </Head>

      {children}

      {loggedIn ? <Footer /> : null}
    </>
  );
}
