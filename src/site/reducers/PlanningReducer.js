"use strict";

import * as planningActions from "../actions/PlanningActions";
import * as txActions from "../actions/TransactionActions";

export default function (state = {}, action) {
  
  state = Object.assign({}, state);
  state.error = null;
  state.messages = null;
  
  switch (action.type) {
    case planningActions.PLANNED_TXS_FETCH_SUCCESS:
      return { 
        transactions: action.transactions, 
        categories: action.categories,
        isUpdated: true 
      };
    case txActions.DELETE_SUCCESS:
      return { status: "deleted" };
    case planningActions.PLANNED_TXS_FETCH_FAIL:
      return { error: action.error, isUpdated: true };
    case txActions.DELETE_FAIL:
      state.error = action.error;
      return state;
    default:
      state.pass = true;
      return state;
  }

}
