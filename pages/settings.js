import React from "react";
import Link from "next/link";
import Router from "next/router";
import { useMappedState } from "redux-react-hook";

import { Services } from "../lib/with-services";
import { getHighestLevel } from '../lib/user-utils'

import LeftArrow from "../static/left-arrow.svg";

function Header({ imageSrc }) {
  const bounds = React.useMemo(() => ({ width: '100px', height: '100px' }), [])

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
      <div className="flex flex-1">
        <div className="bg-white p-2 rounded-full flex ml-auto justify-center overflow-hidden" style={bounds}>
          <img style={{ height: '80px' }} src={imageSrc}  />
        </div>
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
  const latestLevel = getHighestLevel(personalInfo.levels);

  const rankImage = `/static/level-${latestLevel.levelId}.svg`;

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
          <img src={rankImage} style={{ height: '140px' }} />
        </div>
        <div className="mt-10 text-base">
          <button onClick={handleLogout} className="font-semibold block p-3 underline text-left w-full">Odhlásit se</button>
        </div>
      </div>
    </div>
  );
}
