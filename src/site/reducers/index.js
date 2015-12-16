import { combineReducers } from "redux";
import test from "./test";
import auth from "./auth";
import login from "./login";
import content from "./content";

export default function(reducers) {
  
  /*
  const reducerModules = {};
  reducers.forEach(reducer => {
    reducerModules[reducer] = require(`./${reducer}`);
  });

  return combineReducers(reducerModules);
  */
  
  return combineReducers({
    test,
    auth,
    login,
    content
  });

}
