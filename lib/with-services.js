import React from "react";
import { isServer } from "./utils";
import Api from "./api";

const __NEXT_SERVICES__ = "__NEXT_SERVICES__";

function createServices(services) {
  return {
    api: new Api({
      dispatcher: services.reduxStore.dispatch,
      reduxStore: services.reduxStore
    })
  };
}

function getOrCreateServices(services) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer()) {
    return createServices(services);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_SERVICES__]) {
    window[__NEXT_SERVICES__] = createServices(services);
  }
  return window[__NEXT_SERVICES__];
}

export const Services = React.createContext({});

export const withServices = App => {
  return class AppWithServices extends React.Component {
    static async getInitialProps(appContext) {
      const { ctx } = appContext;

      const services = getOrCreateServices(ctx);

      appContext.ctx.services = services;

      let appProps = {};
      if (typeof App.getInitialProps === "function") {
        appProps = await App.getInitialProps(appContext);
      }

      return { ...appProps, services, reduxStore: ctx.reduxStore };
    }

    services = getOrCreateServices({ ...this.props });

    render() {
      return <App {...this.props} services={this.services} />;
    }
  };
};
