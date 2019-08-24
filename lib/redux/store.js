import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

export const INITIAL_STATE = {
  levels: [],
  lockedLevels: {},
  exercises: {
    level1: []
  },
  user: {}
};

export function makeStore(initialState) {
  return createStore(reducer, initialState, composeWithDevTools());
}
