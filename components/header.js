import React from "react";
import classNames from "classnames";
import { useMappedState } from "redux-react-hook";
import { useRouter } from "next/router";
import Link from "next/link";

import Fox from "../public/fox.svg";
import "./header.css";

export function Levels() {
  const mapState = React.useCallback(
    state => ({
      levels: state.levels
    }),
    []
  );
  const { levels } = useMappedState(mapState);
  const router = useRouter();
  const { level: activeLevel = 1 } = router.query;

  return (
    <div className="flex mt-2">
      {levels?.map(level => (
        <Link href={{ query: { level: level.levelId } }} key={level._id}>
          <button
            className={classNames({
              "border-gray-500 border-solid border p-1 rounded text-xss mr-1 whitespace-no-wrap": true,
              "bg-white font-semibold": level.levelId == activeLevel
            })}
          >
            {level.title}
          </button>
        </Link>
      ))}
    </div>
  );
}

export function Header() {
  return (
    <div className="sticky top-0 w-full flex items-center overflow-hidden header-bg px-3">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold leading-none">
          Ovládni <br />
          pravopis.cz
        </h1>
        <Levels />
      </div>
      <div className="flex flex-1 mt-2">
        <Fox className="flex ml-auto pt-3" />
      </div>
    </div>
  );
}
