"use strict";

import http from "../tools/http-client";
import { processResponse } from "./utils";

export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FETCH_FAIL = "FETCH_FAIL";
export const TX_FETCH_SUCCESS = "TX_FETCH_SUCCESS";
export const TX_FETCH_FAIL = "TX_FETCH_FAIL";
export const SAVE_SUCCESS = "SAVE_SUCCESS";
export const SAVE_FAIL = "SAVE_FAIL";
export const DELETE_SUCCESS = "DELETE_SUCCESS";
export const DELETE_FAIL = "DELETE_FAIL";

export function saveGoal(user, goal) {
  
  return async (dispatch) => {
    
    let response = await http.post(`/api/finance/goals/${user}`, goal);
    const action = processResponse(response, SAVE_SUCCESS, SAVE_FAIL);
    if (action.type === SAVE_SUCCESS) {
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
    const action = processResponse(response, TX_FETCH_SUCCESS, TX_FETCH_FAIL);
    if (action.type === TX_FETCH_SUCCESS) {
      action.transactions = response.transactions;
    }
    
    dispatch(action);
  
  };

}

