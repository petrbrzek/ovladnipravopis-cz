import React from "react";
import Link from "next/link";
import Router from "next/router";
import { useMappedState } from "redux-react-hook";

import { Services } from "../lib/with-services";

import Fox from "../static/fox.svg";
import LeftArrow from "../static/left-arrow.svg";

function Header({ imageSrc }) {
  return (
    <div className="sticky top-0 w-full flex items-center overflow-hidden header-bg px-3">
      <div className="flex flex-col">
        <Link href={`/`}>
          <a className="flex flex-1 items-center px-1">
            <LeftArrow />
          </a>
        </Link>
      </div>
      <div className="flex flex-col flex-1 justify-center p-2 px-3">
        <h1 className="text-base font-bold leading-tight">Můj profil</h1>
      </div>
      <div className="flex flex-1 mt-2">
        <img width="50" src={imageSrc} className="flex ml-auto pt-3" />
      </div>
    </div>
  );
}

export default function Settings() {
  const services = React.useContext(Services);
  const mapState = React.useCallback(
    state => ({
      personalInfo: state.user.personalInfo
    }),
    []
  );
  const { personalInfo } = useMappedState(mapState);
  const latestLevel = personalInfo.levels[personalInfo.levels.length - 1];
  const rankImage = `/static/${latestLevel.rank.toLowerCase()}.svg`;

  const handleLogout = async () => {
    const { api } = services;
    await api.get(api.normalizeUrl(`/api/user/logout`));
    Router.push("/");
  };

  return (
    <div className="flex flex-col flex-1">
      <Header imageSrc={rankImage} />
      <div className="p-3">
        <div className="flex justify-center">
          <img width="80" src={rankImage} />
        </div>
        <button onClick={handleLogout}>Odhlásit</button>
      </div>
    </div>
  );
}
