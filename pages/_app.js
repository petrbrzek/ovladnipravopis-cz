import "../static/styles/index.css";

import React from "react";
import App from "next/app";
import Router from "next/router";
import { StoreContext } from "redux-react-hook";

import withUser from "../lib/with-user";
import withRedux from "../lib/redux/with-redux";
import { withServices, Services } from "../lib/with-services";
import Global from "../components/global";
import * as gtag from "../lib/gtag";

Router.events.on("routeChangeComplete", url => gtag.pageview(url));

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore, services } = this.props;
    return (
      <Services.Provider value={services}>
        <StoreContext.Provider value={reduxStore}>
          <Global>
            <Component {...pageProps} />
          </Global>
        </StoreContext.Provider>
      </Services.Provider>
    );
  }
}

export default withRedux(withServices(withUser(MyApp)));
