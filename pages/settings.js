import React from "react";
import Link from "next/link";
import Router from "next/router";
import { useMappedState } from "redux-react-hook";

import { Services } from "../lib/with-services";
import { getHighestLevel } from "../lib/user-utils";

import LeftArrow from "../static/left-arrow.svg";

function Header({ imageSrc }) {
  const bounds = React.useMemo(() => ({ width: "100px", height: "100px" }), []);

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
        <div
          className="bg-white p-2 rounded-full flex ml-auto justify-center overflow-hidden"
          style={bounds}
        >
          <img style={{ height: "80px" }} src={imageSrc} />
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

  const statusDescription = {
    level1: "chybuje i v nejzákladnějších pravopisných jevech.",
    level2: "bezpečně ovládá pravopis na úrovni prvního stupně základní školy.",
    level3:
      "ovládá pravopis i u méně běžných slov. Základní poznatky o pravopise dokáže kombinovat.",
    level4:
      "skvěle se vyzná v systému pravopisu, ovládá základní i obtížné jevy a své znalosti kombinuje.",
    level5:
      "perfektně ovládá pravopis, rozumí jeho pravidlům a chybuje jen, když se špatně vyspí."
  };

  return (
    <div className="flex flex-col flex-1">
      <Header imageSrc={rankImage} />
      <div className="p-3">
        <div className="flex justify-center">
          <img src={rankImage} style={{ height: "140px" }} />
        </div>
        <div className="mt-5 text-base">
          <div className="font-bold p-3 pb-1">Status:</div>
          <p className="px-3 text-xss">
            <b>{latestLevel.rank} - </b>
            <span> {statusDescription[`level${latestLevel.levelId}`]}</span>
          </p>
        </div>
        <div className="mt-3 text-base">
          <div className="font-bold p-3 pb-1">Průběžná známka:</div>
          <p className="px-3 text-xss">
            <b>{5 - latestLevel.levelId + 1}</b>
          </p>
        </div>
        <div className="mt-3 text-base">
          <div className="font-bold p-3 pb-1">O aplikaci</div>
          <p className="px-3 text-xss">
            Aplikace je postavena na postupném zvládnutí čtyř úrovní obtížnosti.
            Ovládnutí každé z úrovní s sebou nese otevření další úrovně,
            povýšení v rámci statusu a zlepšení průběžné známky. Jednotlivá
            cvičení jsou založena na schopnosti rozpoznat pravopisně správnou
            variantu slova, slovního spojení či věty.
          </p>
        </div>
        <div className="mt-3 text-base">
          <div className="font-bold p-3 pb-1">Kontakt a hlášení bugů 🐞</div>
          <p className="px-3 text-xss">
            Máte nápad na zlepšení aplikace? Nebo nějakou připomínku? Anebo jste
            narazili na bug, či dokonce na pravopisnou chybu?!
            <br />
            Dejte mi vědět :).
            <br />
            <br />
            <a href="mailto:sarka.brzkova@lauder.cz" className="font-semibold">
              sarka.brzkova@lauder.cz
            </a>
          </p>
        </div>
        <div className="mt-5 text-base">
          <button
            onClick={handleLogout}
            className="font-bold block p-3 text-left w-full"
          >
            Odhlásit se 🖐
          </button>
        </div>
      </div>
    </div>
  );
}
