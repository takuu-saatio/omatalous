"use strict";

import http from "../tools/http-client";

export const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";
export const REG_SUCCESS = "REG_SUCCESS";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REG_FAIL = "REG_FAIL";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT_FAIL = "LOGOUT_FAIL";

function processResponse(response, successType, failType, dataKey) {
  
  if (response.error) {
    return { 
      type: failType,
      error: response.error
    };
  } else {
    let state = { type: successType };
    if (dataKey) {
      return Object.assign(state, JSON.parse(`{ "${dataKey}": ${JSON.stringify(response[dataKey])} }`));
    } else {
      return state;
    }
    
  }
  
}

export function register(regParams) {
  
  //let response = await http.post("/api/register", regParams);
  let response = { status: "ok", user: { email: "nnn", password: "jjj" } };
  return processResponse(response, REG_SUCCESS, REG_FAIL, "user");

}

export function logIn(loginParams) {
  
  loginParams.method = "password";
  return async (dispatch) => {
    let response = await http.post("/api/login", loginParams);
    console.log("got resp", response);
    //let response = { status: "ok", user: { email: "nnn", password: "jjj" } };
    dispatch(processResponse(response, LOGIN_SUCCESS, LOGIN_FAIL, "user"));
  };

}

export function logOut(user) {
  
  //let response = await http.post("/api/logout"); 
  let response = { status: "ok", user: { email: "nnn", password: "jjj" } };
  return processResponse(response, LOGOUT_SUCCESS, LOGOUT_FAIL);

}

export function test() {
  return {
    type: LOG_IN
  };
}

