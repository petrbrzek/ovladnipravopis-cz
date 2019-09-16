import React from "react";
import { useMappedState } from "redux-react-hook";
import Link from "next/link";

import { getHighestLevel } from "../lib/user-utils";
import User from "../public/user.svg";

import "./footer.css";

export default function Footer() {
  const mapState = React.useCallback(
    state => ({
      user: state.user
    }),
    []
  );
  const { user } = useMappedState(mapState);
  const highestRank =
    getHighestLevel(user?.personalInfo?.levels)?.rank || "???";

  return (
    <div className="footer sticky bottom-0 text-xs flex items-center text-gray-300 font-bold">
      <div className="flex px-3">
        <p className="p-1">Status: {highestRank}</p>
      </div>
      <Link href={`/settings`}>
        <a className="flex ml-auto footer__user items-center h-full p-3 px-5">
          <User />
        </a>
      </Link>
    </div>
  );
}
