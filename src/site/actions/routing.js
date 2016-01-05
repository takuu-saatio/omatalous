"use strict";

import { pushPath } from "redux-simple-router";

export function go(path) {
  
  return (dispatch) => {
    dispatch(pushPath(path));
  };

}
