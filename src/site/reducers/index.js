import { combineReducers } from "redux";
import test from "./test";
import auth from "./auth";
import home from "./home";
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
    home,
    login,
    content
  });

}
