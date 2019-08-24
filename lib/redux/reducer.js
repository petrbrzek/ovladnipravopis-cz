import { INITIAL_STATE } from "./store";

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ADD_LEVELS": {
      return {
        ...state,
        levels: action.levels
      };
    }

    case "ADD_EXERCISES": {
      const lockedLevels = { ...state.lockedLevels };
      delete lockedLevels[`level${action.level}`];

      return {
        ...state,
        exercises: {
          ...state.exercises,
          [`level${action.level}`]: action.exercises
        },
        lockedLevels
      };
    }

    case "LEVEL_LOCKED": {
      return {
        ...state,
        lockedLevels: {
          ...state.lockedLevels,
          [`level${action.level}`]: true
        }
      };
    }

    case "CLOSE_MODAL": {
      return {
        ...state,
        modalIsOpen: false
      };
    }

    case "USER:PERSONAL_INFO": {
      return {
        ...state,
        user: {
          ...state.user,
          personalInfo: action.personalInfo
        }
      };
    }

    case "USER:LOGGED_IN": {
      return {
        ...state,
        user: {
          ...state.user,
          loggedIn: action.loggedIn
        }
      };
    }

    case "USER:LOG_OUT": {
      return {
        ...state,
        user: {
          ...state.user,
          loggedIn: action.loggedIn
        }
      };
    }

    default:
      return state;
  }
}
