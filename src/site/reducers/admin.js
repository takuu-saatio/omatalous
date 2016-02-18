"use strict";

import * as actions from "../actions/admin";

export default function (state = {}, action) {
  
  state = Object.assign({}, state);
  state.error = null;
  
  console.log("action", action, state);
  switch (action.type) {
    case actions.FETCH_SUCCESS:
      return { accounts: action.accounts, isUpdated: true };
    case actions.FETCH_FAIL:
      state.error = action.error;
      return state;
    default:
      state.pass = true;
      return state;
  }

}
