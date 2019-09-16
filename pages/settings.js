import React from "react";

import { Services } from "../lib/with-services";
import Router from "next/router";

export default function Settings() {
  const services = React.useContext(Services);

  const handleLogout = async () => {
    await services.api.get(`${process.env.API_ENDPOINT}/api/user/logout`);
    Router.push("/");
  };

  return (
    <div className="flex flex-col flex-1">
      <h1>Settings</h1>
      <button onClick={handleLogout}>Odhlasit se</button>
    </div>
  );
}
