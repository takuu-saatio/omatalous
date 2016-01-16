"use strict";

import http from "../tools/http-client";
import { processResponse } from "./utils";

export const FETCH_SUCCESS = "TX_FETCH_SUCCESS";
export const FETCH_FAIL = "TX_FETCH_FAIL";
export const SAVE_SUCCESS = "TX_SAVE_SUCCESS";
export const SAVE_FAIL = "TX_SAVE_FAIL";
export const DELETE_SUCCESS = "TX_DELETE_SUCCESS";
export const DELETE_FAIL = "TX_DELETE_FAIL";

export function saveTransaction(user, transaction) {
  
  return async (dispatch) => {
    
    let response = await http.post(`/api/finance/transactions/${user}`, transaction);
    const action = processResponse(response, SAVE_SUCCESS, SAVE_FAIL);
    if (action.type === SAVE_SUCCESS) {
      action.created = response.created;
      if (response.transaction) {
        action.transaction = response.transaction;
      } else {
        action.transaction = transaction;
      }
      console.log("DISPATCH", action, response);
    }
    dispatch(action);
  
  };

}


export function deleteTransaction(user, uuid) {
  
  return async (dispatch) => {
    
    let response = await http.delete(`/api/finance/transactions/${user}/${uuid}`);
    const action = processResponse(response, DELETE_SUCCESS, DELETE_FAIL);
    dispatch(action);
  
  };

}

export function fetchTransaction(user, uuid) {
  
  return async (dispatch) => {
    
    let response = await http.get(`/api/finance/transactions/${user}/${uuid}`);
    const action = processResponse(response, FETCH_SUCCESS, FETCH_FAIL);
    if (action.type === FETCH_SUCCESS) {
      action.transaction = response.transaction;
    }
    dispatch(action);
  
  };

}
