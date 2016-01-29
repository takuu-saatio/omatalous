"use strict";

import http from "../tools/http-client";
import { processResponse } from "./utils";

export const PLANNED_TXS_FETCH_SUCCESS = "PLANNED_TXS_FETCH_SUCCESS";
export const PLANNED_TXS_FETCH_FAIL = "PLANNED_TXS_FETCH_FAIL";
export const SAVE_SUCCESS = "SAVE_SUCCESS";
export const SAVE_FAIL = "SAVE_FAIL";
export const DELETE_SUCCESS = "DELETE_SUCCESS";
export const DELETE_FAIL = "DELETE_FAIL";

export function fetchPlannedTransactions(user) {
  
  return async (dispatch) => {
    
    let response = await http.get(`/api/finance/transactions/${user}?type=planned`);
    const action = processResponse(response, 
      PLANNED_TXS_FETCH_SUCCESS, PLANNED_TXS_FETCH_FAIL);
    
    if (action.type === PLANNED_TXS_FETCH_SUCCESS) {
      
      action.transactions = response.transactions; 
      
      response = await http.get(`/api/finance/categories/${user}`);
      if (response.categories) {
        action.categories = response.categories;
      }
    
    }

    dispatch(action);
  
  };

}
