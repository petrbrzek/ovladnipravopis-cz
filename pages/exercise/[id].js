import React from "react";
import Router from "next/router";
import Link from "next/link";
import classNames from "classnames";
import Confetti from "react-confetti";

import { Services } from "../../lib/with-services";
import { shuffleArray } from "../../lib/utils";

import "./exercise.css";
import LeftArrow from "../../static/left-arrow.svg";
import FoxLeftSide from "../../static/fox-left-side.svg";
import DoneOutline from "../../static/done_outline.svg";

function Header({ title, levelId }) {
  const content = `Klikni na všechny karty, které obsahují pravopisně správný text. 
    Pokud označíš nesprávnou kartu, hra okamžitě končí a musíš začít znovu.`;
  return (
    <div className="flex px-2 header-bg sticky top-0">
      <div className="flex flex-col">
        <Link href={`/?level=${levelId}`}>
          <a className="flex flex-1 items-center px-1">
            <LeftArrow />
          </a>
        </Link>
      </div>
      <div className="flex flex-col flex-1 justify-center p-2 px-3">
        <h1 className="text-base font-bold leading-tight">{title}</h1>
        <p className="text-xsss leading-tight pt-1">{content}</p>
      </div>

      <div className="flex mt-auto">
        <FoxLeftSide />
      </div>
    </div>
  );
}

const handleAllCorrectCards = ({ allCorrect, api, exerciseId, levelId }) => {
  React.useEffect(() => {
    if (!allCorrect) {
      return;
    }

    sendUserStats(api, {
      exerciseId,
      state: "FINISHED",
    });

    api.post(api.normalizeUrl(`/api/user/mark`), {
      json: { exerciseId },
    });

    const timeout = setTimeout(() => {
      Router.push(`/?level=${levelId}`);
    }, 4000);
    return () => clearTimeout(timeout);
  }, [allCorrect]);
};

const checkIfAllCardsAreCorrect = (cards, cardsRating) => {
  const correctCards = cards.filter((card) => card.correct);
  if (correctCards.length === 0) {
    return false;
  }
  return correctCards.every((card) => cardsRating[card._id]);
};

const checkIfCardIsCorrect = (cardId, cards) => {
  const card = cards.find((card) => card._id == cardId);
  return card.correct;
};

const sendUserStats = (api, { exerciseId, cardId, state }, options = {}) => {
  api.post(api.normalizeUrl(`/api/user/stats`, options.req), {
    ...options,
    json: {
      exerciseId,
      cardId,
      state,
    },
  });
};

export default function Exercise({ exercise, cards }) {
  const services = React.useContext(Services);
  const [cardsRating, setCardRating] = React.useState({});
  const [mistake, setMistake] = React.useState(false);

  const handleCardClick = (id) => {
    const correct = checkIfCardIsCorrect(id, cards);
    if (correct) {
      setCardRating({ ...cardsRating, [id]: { correct: true } });
      return;
    }

    setCardRating({ ...cardsRating, [id]: { correct: false } });
    setMistake(true);
    sendUserStats(services.api, {
      exerciseId: exercise._id,
      cardId: id,
      state: "FAILED",
    });
  };

  const handleAnimationEnd = (e) => {
    if (event.animationName === "wrong") {
      Router.push(`/?level=${exercise.level.levelId}`);
    }
  };

  const isAllCorrect = checkIfAllCardsAreCorrect(cards, cardsRating);
  handleAllCorrectCards({
    api: services.api,
    allCorrect: isAllCorrect,
    exerciseId: exercise._id,
    levelId: exercise.level.levelId,
  });

  const currentCorrectCardsCount = Object.values(cardsRating).filter(
    (value) => value.correct
  ).length;
  const correctCardsCount = cards.filter((card) => card.correct).length;

  return (
    <div className="flex flex-col flex-1">
      {isAllCorrect && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
          }}
        />
      )}
      <Header title={exercise.title} levelId={exercise.level.levelId} />
      <div className="flex flex-col p-3">
        {exercise.cards.map((card) => {
          return (
            <button
              key={card._id}
              onClick={() =>
                !mistake && !isAllCorrect && handleCardClick(card._id)
              }
              onAnimationEnd={handleAnimationEnd}
              className={classNames({
                correct: cardsRating[card._id]?.correct,
                "wrong shake": cardsRating[card._id]?.correct === false,
                default: cardsRating[card._id] == null,
                "border-gray-500 border-solid border p-2 mb-4 rounded-sm": true,
                "text-left font-bold pl-4 text-base text-gray-800": true,
              })}
            >
              {card.content}
            </button>
          );
        })}
        <div className="rating-box flex flex-col items-center correct p-1 rounded-sm fixed">
          <div>
            <DoneOutline />
          </div>
          <b>
            {currentCorrectCardsCount} / {correctCardsCount}
          </b>
        </div>
      </div>
    </div>
  );
}

Exercise.getInitialProps = async ({ query, req, services: { api } }) => {
  const { id } = query;
  const options = {
    headers: {
      cookie: req?.headers?.cookie,
    },
    req,
  };

  sendUserStats(api, { exerciseId: id, state: "OPEN" }, options);

  const [cards, exercise] = await Promise.all([
    api.get(api.normalizeUrl(`/api/cards?exerciseId=${id}`, req), options),
    api.get(api.normalizeUrl(`/api/exercise?id=${id}`, req), options),
  ]);

  return {
    cards,
    exercise: { ...exercise, cards: [...shuffleArray(exercise.cards)] },
  };
};
