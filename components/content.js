import React from "react";
import { useMappedState } from "redux-react-hook";
import { useRouter } from "next/router";
import Link from "next/link";

import OpenLock from "../public/lock-open.svg";
import CheckCircle from "../public/check-circle.svg";
import Spinner from "../public/spinner.svg";
import Lock from "../public/lock.svg";

export default function Content() {
  const mapState = React.useCallback(
    state => ({
      exercises: state.exercises,
      lockedLevels: state.lockedLevels || {}
    }),
    []
  );
  const { exercises, lockedLevels } = useMappedState(mapState);
  const router = useRouter();
  const { level = 1 } = router.query;

  const activeLevel = `level${level}`;
  const levelExercises = exercises[activeLevel]?.exercises || [];

  const isLocked = lockedLevels[activeLevel];

  return (
    <div className="flex flex-1 flex-col">
      {isLocked ? (
        <div className="flex flex-1 justify-center items-center">
          <Lock />
        </div>
      ) : null}

      {!isLocked && levelExercises.length == 0 ? (
        <div className="flex flex-1 justify-center items-center">
          <Spinner />
        </div>
      ) : null}

      {levelExercises.map(exercise => {
        return (
          <Link
            href={`/exercise/[id]`}
            as={`/exercise/${exercise._id}`}
            key={exercise._id}
          >
            <a className="flex p-3 border-solid border-b border-gray-300">
              <div className="pr-2">
                <h2 className="text-base font-bold pb-1">{exercise.title}</h2>
                <p className="text-xs text-gray-800">{exercise.content}</p>
              </div>
              <div className="flex ml-auto">
                {exercise.users?.length ? <CheckCircle /> : <OpenLock />}
              </div>
            </a>
          </Link>
        );
      })}
    </div>
  );
}
