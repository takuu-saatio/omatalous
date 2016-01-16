"use strict";

import http from "../tools/http-client";
import { processResponse } from "./utils";

export const GOAL_FETCH_SUCCESS = "GOAL_FETCH_SUCCESS";
export const GOAL_FETCH_FAIL = "GOAL_FETCH_FAIL";
export const TXS_FETCH_SUCCESS = "TXS_FETCH_SUCCESS";
export const TXS_FETCH_FAIL = "TXS_FETCH_FAIL";
export const GOAL_SAVE_SUCCESS = "SAVE_SUCCESS";
export const GOAL_SAVE_FAIL = "SAVE_FAIL";
export const DELETE_SUCCESS = "DELETE_SUCCESS";
export const DELETE_FAIL = "DELETE_FAIL";

export function saveGoal(user, goal) {
  
  return async (dispatch) => {
    
    let response = await http.post(`/api/finance/goals/${user}`, goal);
    const action = processResponse(response, GOAL_SAVE_SUCCESS, GOAL_SAVE_FAIL);
    if (action.type === GOAL_SAVE_SUCCESS) {
      action.created = response.created;
      if (response.goal) {
        action.goal = response.goal;
      }
    }
    
    dispatch(action);
  
  };

}

export function fetchTransactions(user) {
  
  return async (dispatch) => {
    
    let response = await http.get(`/api/finance/transactions/${user}?repeats=1`);
    const action = processResponse(response, TXS_FETCH_SUCCESS, TXS_FETCH_FAIL);
    if (action.type === TXS_FETCH_SUCCESS) {
      action.transactions = response.transactions;
    }
    
    dispatch(action);
  
  };

}

