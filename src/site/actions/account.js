"use strict";

import http from "../tools/http-client";

export const SAVE_SUCCESS = "SAVE_SUCCESS";
export const SAVE_FAIL = "SAVE_FAIL";
export const DELETE_SUCCESS = "DELETE_SUCCESS";
export const DELETE_FAIL = "DELETE_FAIL";

export function saveAccount(user) {
  
  return async (dispatch) => {
    
    let response = await http.put("/api/users", user);
    if (response.error) {
      dispatch({
        type: SAVE_FAIL,
        error: response.error
      });
    } else {
      dispatch({
        type: SAVE_SUCCESS
      });
    }
  
  };

}
