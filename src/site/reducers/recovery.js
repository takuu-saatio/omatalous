"use strict";

import * as actions from "../actions/recovery";

export default function (state = {}, action) {
  
  state = Object.assign({}, state);
  state.error = null;
  
  console.log("action", action);
  switch (action.type) {
    case actions.RECOVERY_SUCCESS:
      return { status: "ok" };
    case actions.RECOVERY_FAIL:
      state.error = action.error;
      return state;
    default:
      return state;
  }

}
