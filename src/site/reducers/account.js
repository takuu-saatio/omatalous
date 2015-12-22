"use strict";

import * as actions from "../actions/account";

export default function (state = {}, action) {
  
  state = Object.assign({}, state);
  state.error = null;
  
  console.log("action", action);
  switch (action.type) {
    case actions.SAVE_SUCCESS:
      return { status: "ok" };
    case actions.DELETE_SUCCESS:
      return { status: "ok" };
    case actions.SAVE_FAIL:
    case actions.DELETE_FAIL:
      state.error = action.error;
      return state;
    default:
      return state;
  }

}
