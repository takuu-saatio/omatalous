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
      if (action.categories) {
        state.categories = action.categories;
      }
      return state;
    case goalsActions.GOAL_SAVE_SUCCESS:
      return { 
        messages: { 
          goal: { editStatus: "saved" } 
        }, 
        created: action.created, 
        isUpdated: true 
      };
    case goalsActions.CAT_SAVE_SUCCESS:
      return { 
        messages: { 
          categories: { editStatus: "saved" } 
        }, 
        isUpdated: true 
      };
    case goalsActions.TXS_FETCH_FAIL:
      return { error: action.error, isUpdated: true };
    case txActions.DELETE_SUCCESS:
      return { status: "deleted" };
    case goalsActions.GOAL_SAVE_FAIL:
      state.error = action.error;
      state.messages = { 
        goal: { editStatus: "save_failed" }
      };
      return state;
    case goalsActions.CAT_SAVE_FAIL:
      state.error = action.error;
      state.messages = { 
        categories: { editStatus: "save_failed" }
      };
      return state;
    case txActions.DELETE_FAIL:
      state.error = action.error;
      return state;
    default:
      state.pass = true;
      return state;
  }

}
