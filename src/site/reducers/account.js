"use strict";

import * as actions from "../actions/account";

export default function (state = {}, action) {
  
  state = Object.assign({}, state);
  state.error = null;
  
  console.log("action", action);
  switch (action.type) {
    case actions.FETCH_SUCCESS:
      return { account: action.account, isUpdated: true };
    case actions.SAVE_SUCCESS:
    case actions.DELETE_SUCCESS:
      return { status: "ok" };
    case actions.FETCH_FAIL:
    case actions.SAVE_FAIL:
    case actions.DELETE_FAIL:
      state.error = action.error;
      return state;
    default:
      return state;
  }

}
