"use strict";

import http from "../tools/http-client";
import { processResponse } from "./utils";

export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FETCH_FAIL = "FETCH_FAIL";

export function fetchAccounts() {
  
  return async (dispatch) => {
    
    let response = await http.get(`/api/users`);
    const action = processResponse(response, FETCH_SUCCESS, FETCH_FAIL);
    if (action.type === FETCH_SUCCESS) {
      action.accounts = response.users;
    }
    dispatch(action);
  
  };

}
