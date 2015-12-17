"use strict";

import * as actions from "../actions/auth";

export default function (state = {}, action) {
  
  //state.error = null;

  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return { user: action.user };
    case actions.LOGOUT_SUCCESS:
      state.user = null;
      return state;
    case actions.LOG_IN:
      return Object.assign(state, { hip: "hei" });
    default:
      return Object.assign(state,
        action.error ? { 
          error: {
            cause: action.error,
            message: "Log-in failed"
          }
        } : {});

  }

}
