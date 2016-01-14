"use strict";

import * as actions from "../actions/TransactionActions";

export default function (state = {}, action) {
  
  state = Object.assign({}, state);
  state.error = null;
  state.messages = null;
  
  console.log("action", state, action);
  switch (action.type) {
    case actions.FETCH_SUCCESS:
      return { transaction: action.transaction, isUpdated: true };
    case actions.SAVE_SUCCESS:
      console.log("return save state");
      return { messages: { editStatus: "saved" }, created: action.created, isUpdated: true };
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
