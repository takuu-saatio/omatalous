"use strict";

import http from "../tools/http-client";
import { processResponse } from "./utils";

export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FETCH_FAIL = "FETCH_FAIL";
export const SAVE_SUCCESS = "SAVE_SUCCESS";
export const SAVE_FAIL = "SAVE_FAIL";
export const DELETE_SUCCESS = "DELETE_SUCCESS";
export const DELETE_FAIL = "DELETE_FAIL";

export function saveBudget(user, budget) {
  
  return async (dispatch) => {
    
    let response = await http.post(`/api/finance/budgets/${user}`, budget);
    const action = processResponse(response, SAVE_SUCCESS, SAVE_FAIL);
    if (action.type === SAVE_SUCCESS) {
      action.created = response.created;
      action.budget = response.budget;
    }
    dispatch(action);
  
  };

}


export function deleteBudget(uuid) {
  
  return async (dispatch) => {
    
    let response = await http.delete(`/api/finance/budgets/${uuid}`);
    const action = processResponse(response, DELETE_SUCCESS, DELETE_FAIL);
    dispatch(action);
  
  };

}

export function fetchBudgets(user) {
  
  return async (dispatch) => {
    
    let response = await http.get(`/api/finance/budgets/${user}`);
    const action = processResponse(response, FETCH_SUCCESS, FETCH_FAIL);
    if (action.type === FETCH_SUCCESS) {
      action.budgets = response.budgets;
    }
    dispatch(action);
  
  };

}
