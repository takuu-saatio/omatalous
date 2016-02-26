"use strict";

import * as actions from "../actions/TransactionActions";

export default function (state = {}, action) {
  
  state = Object.assign({}, state);
  state.error = null;
  state.messages = null;
  delete state.pass;
  
  console.log("action", state, action);
  switch (action.type) {
    case actions.TX_FETCH_SUCCESS:
      return { transaction: action.transaction, isUpdated: true };
    case actions.TX_SAVE_SUCCESS:
      return { 
        status: "saved",
        messages: { editStatus: "saved" }, 
        created: action.created, 
        isUpdated: true 
      };
    case actions.TX_DELETE_SUCCESS:
      return { status: "deleted" };
    case actions.TX_SAVE_FAIL:
      state.messages = { editStatus: "save_failed" };
      return state;
    case actions.TX_FETCH_FAIL:
      state.pass = true;
      return state;
    case actions.TX_DELETE_FAIL:
      state.error = action.error;
      return state;
    default:
      state.pass = true;
      return state;
  }

}
