"use strict";

import http from "../tools/http-client";
import { processResponse } from "./utils";

export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FETCH_FAIL = "FETCH_FAIL";
export const SAVE_SUCCESS = "SAVE_SUCCESS";
export const SAVE_FAIL = "SAVE_FAIL";
export const DELETE_SUCCESS = "DELETE_SUCCESS";
export const DELETE_FAIL = "DELETE_FAIL";

export function quickSaveTransaction(user, quickTransaction) {
  
  return async (dispatch) => {
    
    let response = await http.post(`/api/finance/transactions/${user}`, quickTransaction);
    const action = processResponse(response, SAVE_SUCCESS, SAVE_FAIL);
    if (action.type === SAVE_SUCCESS) {
      action.created = response.created;
      action.quickTransaction = response.transaction;
    }
    dispatch(action);
  
  };

}


export function quickDeleteTransaction(user, uuid) {
  
  return async (dispatch) => {
    
    let response = await http.delete(`/api/finance/transactions/${user}/${uuid}`);
    const action = processResponse(response, DELETE_SUCCESS, DELETE_FAIL);
    dispatch(action);
  
  };

}

export function fetchTransactions(user) {
  
  return async (dispatch) => {
    
    let response = await http.get(`/api/finance/transactions/${user}?repeats=0`);
    const action = processResponse(response, FETCH_SUCCESS, FETCH_FAIL);
    if (action.type === FETCH_SUCCESS) {
      action.transactions = response.transactions;
    }
    dispatch(action);
  
  };

}