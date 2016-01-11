import { combineReducers } from "redux";
import { routeReducer } from "redux-simple-router";
import test from "./test";
import auth from "./auth";
import home from "./home";
import login from "./login";
import recovery from "./recovery";
import account from "./account";
import transactions from "./transactions";
import content from "./content";
import admin from "./admin";

export default function(reducers) {
  
  /*
  const reducerModules = {};
  reducers.forEach(reducer => {
    reducerModules[reducer] = require(`./${reducer}`);
  });

  return combineReducers(reducerModules);
  */
  
  return combineReducers({
    routing: routeReducer,
    test,
    auth,
    home,
    login,
    recovery,
    account,
    transactions,
    content,
    admin
  });

}
