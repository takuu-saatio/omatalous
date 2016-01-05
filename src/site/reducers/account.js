"use strict";

import * as actions from "../actions/account";

export default function (state = {}, action) {
  
  state = Object.assign({}, state);
  state.error = null;
  state.messages = null;
  
  //console.log("action", action);
  switch (action.type) {
    case actions.FETCH_SUCCESS:
      return { account: action.account, isUpdated: true };
    case actions.SAVE_SUCCESS:
      return { messages: { editStatus: "saved" }, pwdSaved: action.pwdChanged };
    case actions.DELETE_SUCCESS:
      return { status: "deleted" };
    case actions.SAVE_FAIL:
      state.messages = { editStatus: "save_failed" };
    case actions.FETCH_FAIL:
    case actions.DELETE_FAIL:
      state.error = action.error;
      return state;
    default:
      return state;
  }

}
