"use strict";

import http from "../tools/http-client";
import { processResponse } from "./utils";

export const GOAL_FETCH_SUCCESS = "GOAL_FETCH_SUCCESS";
export const GOAL_FETCH_FAIL = "GOAL_FETCH_FAIL";
export const TXS_FETCH_SUCCESS = "TXS_FETCH_SUCCESS";
export const TXS_FETCH_FAIL = "TXS_FETCH_FAIL";
export const GOAL_SAVE_SUCCESS = "GOAL_SAVE_SUCCESS";
export const GOAL_SAVE_FAIL = "GOAL_SAVE_FAIL";
export const GOAL_DELETE_SUCCESS = "GOAL_DELETE_SUCCESS";
export const GOAL_DELETE_FAIL = "GOAL_DELETE_FAIL";
export const CAT_SAVE_SUCCESS = "CAT_SAVE_SUCCESS";
export const CAT_SAVE_FAIL = "CAT_SAVE_FAIL";

export function fetchGoal(user) {
  
  return async (dispatch) => {
    
    let response = await http.get(`/api/finance/goals/${user}`);
    const action = processResponse(response, GOAL_FETCH_SUCCESS, GOAL_FETCH_FAIL);
    if (action.type === GOAL_FETCH_SUCCESS) {
      
      if (response.goals && response.goals.length > 0) {
        action.goal = response.goals[0];
      }
      
      response = await http.get(`/api/finance/categories/${user}`);
      if (response.categories) {
        action.categories = response.categories;
      }

    }
    
    dispatch(action);
  
  };

}

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

export function deleteGoal(user, uuid) {
  
  return async (dispatch) => {
    
    let response = await http.delete(`/api/finance/goals/${user}/${uuid}`);
    const action = processResponse(response, GOAL_DELETE_SUCCESS, GOAL_DELETE_FAIL); 
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

export function saveCategories(user, categories) {
  
  return async (dispatch) => {
    
    let response = await http.post(`/api/finance/categories/${user}`, categories);
    const action = processResponse(response, CAT_SAVE_SUCCESS, CAT_SAVE_FAIL);
    dispatch(action);
  
  };

}
