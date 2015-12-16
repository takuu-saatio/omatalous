"use strict";

import http from "../tools/http-client";

export const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT_FAIL = "LOGOUT_FAIL";

function processResponse(response, successType, failType, dataKey) {
  
  if (response.error) {
    return { 
      type: failType,
      error: response.error
    };
  } else {
    return Object.assign({
      type: successType
    }, {
      dataKey ?
        JSON.parse(`{ "${dataKey}": ${JSON.stringify(response[dataKey])} }`) : {};
    });
  }
  
}

export function logIn(loginParams) {
  
  let response = await http.post("/api/login", loginParams);
  return processResponse(response, LOGIN_SUCCESS, LOGIN_FAIL, "user");

}

export function logOut(user) {
  
  let response = await http.post("/api/logout"); 
  return processResponse(response, LOGOUT_SUCCESS, LOGOUT_FAIL);

}
