import { combineReducers } from "redux";

export default function(reducers) {

  const reducerModules = {};
  reducers.forEach(reducer => {
    reducerModules[reducer] = require(`./${reducer}`);
  });

  return combineReducers(reducerModules);

}
