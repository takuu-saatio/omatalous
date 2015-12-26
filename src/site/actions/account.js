"use strict";

import http from "../tools/http-client";
import { processResponse } from "./utils";

export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FETCH_FAIL = "FETCH_FAIL";
export const SAVE_SUCCESS = "SAVE_SUCCESS";
export const SAVE_FAIL = "SAVE_FAIL";
export const DELETE_SUCCESS = "DELETE_SUCCESS";
export const DELETE_FAIL = "DELETE_FAIL";

export function saveAccount(user) {
  
  return async (dispatch) => {
    
    let response = await http.put("/api/users", user);
    const action = processResponse(response, SAVE_SUCCESS, SAVE_FAIL);
    dispatch(action);
  
  };

}


export function deleteAccount(uuid) {
  
  return async (dispatch) => {
    
    let response = await http.delete(`/api/users/${uuid}`);
    const action = processResponse(response, DELETE_SUCCESS, DELETE_FAIL);
    dispatch(action);
  
  };

}

export function fetchAccount(uuid) {
  
  return async (dispatch) => {
    
    let response = await http.get(`/api/users/${uuid}`);
    const action = processResponse(response, FETCH_SUCCESS, FETCH_FAIL);
    if (action.type === FETCH_SUCCESS) {
      action.account = response.user;
    }
    dispatch(action);
  
  };

}
