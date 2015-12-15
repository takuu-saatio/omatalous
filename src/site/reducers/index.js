import { combineReducers } from "redux";
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
    login,
    content
  });

}
