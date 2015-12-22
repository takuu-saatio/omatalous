import { combineReducers } from "redux";
import test from "./test";
import auth from "./auth";
import home from "./home";
import login from "./login";
import recovery from "./recovery";
import account from "./account";
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
    recovery,
    account,
    content
  });

}
