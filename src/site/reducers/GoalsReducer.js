"use strict";

import * as goalsActions from "../actions/GoalsActions";
import * as txActions from "../actions/TransactionActions";

export default function (state = {}, action) {
  
  state = Object.assign({}, state);
  state.error = null;
  state.messages = null;
  
  switch (action.type) {
    case goalsActions.TXS_FETCH_SUCCESS:
      return { transactions: action.transactions, isUpdated: true };
    case goalsActions.GOAL_FETCH_SUCCESS:
      const state = { isUpdated: true };
      if (action.goal) {
        state.goal = action.goal;
      }
      return state;
    case goalsActions.GOAL_SAVE_SUCCESS:
      return { messages: { editStatus: "saved" }, created: action.created, isUpdated: true };
    case goalsActions.TXS_FETCH_FAIL:
      return { error: action.error, isUpdated: true };
    case txActions.DELETE_SUCCESS:
      return { status: "deleted" };
    case goalsActions.GOAL_SAVE_FAIL:
      state.messages = { editStatus: "save_failed" };
    case txActions.DELETE_FAIL:
      state.error = action.error;
      return state;
    default:
      state.pass = true;
      return state;
  }

}
