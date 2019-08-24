import "../public/styles/index.css";

import React from "react";
import App, { Container } from "next/app";
import { StoreContext } from "redux-react-hook";

import withUser from "../lib/with-user";
import withRedux from "../lib/redux/with-redux";
import { withServices, Services } from "../lib/with-services";
import Global from "../components/global";

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore, services } = this.props;
    return (
      <Container>
        <Services.Provider value={services}>
          <StoreContext.Provider value={reduxStore}>
            <Global>
              <Component {...pageProps} />
            </Global>
          </StoreContext.Provider>
        </Services.Provider>
      </Container>
    );
  }
}

export default withRedux(withServices(withUser(MyApp)));
