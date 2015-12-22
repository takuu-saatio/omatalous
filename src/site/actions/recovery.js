"use strict";

import http from "../tools/http-client";

export const RECOVERY_SUCCESS = "RECOVERY_SUCCESS";
export const RECOVERY_FAIL = "RECOVERY_FAIL";

export function sendLink(recoveryParams) {
  
  return async (dispatch) => {
    
    let response = await http.post("/api/auth/recover", recoveryParams);
    if (response.error) {
      dispatch({
        type: RECOVERY_FAIL,
        error: response.error
      });
    } else {
      dispatch({
        type: RECOVERY_SUCCESS
      });
    }
  
  };

}

