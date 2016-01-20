"use strict";

import * as actions from "../actions/ConsumptionActions";

export default function (state = {}, action) {
  
  state = Object.assign({}, state);
  state.error = null;
  state.messages = null;
  
  //console.log("action", action);
  switch (action.type) {
    case actions.FETCH_SUCCESS:
      return Object.assign({ 
        transactions: action.transactions, 
        isUpdated: true 
      }, action.goal ? { goal: action.goal } : {},
         action.month ? { month: action.month } : {});
    case actions.SAVE_SUCCESS:
      return { messages: { editStatus: "saved" }, created: action.created };
    case actions.DELETE_SUCCESS:
      return { status: "deleted" };
    case actions.SAVE_FAIL:
      state.messages = { editStatus: "save_failed" };
    case actions.FETCH_FAIL:
      return Object.assign(state, { isUpdated: true });
    case actions.DELETE_FAIL:
      state.error = action.error;
      return state;
    default:
      state.pass = true;
      return state;
  }

}
