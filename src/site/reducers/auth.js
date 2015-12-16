"use strict";

import * as actions from "../actions/auth";

export default function (state = {}, action) {
  
  delete state.error;

  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return { user: action.user };
    case actions.LOGOUT_SUCCESS:
      delete state.user;
      return state;
    case actions.LOG_IN:
      return Object.assign({ hip: "hei" }, state);
    default:
      return Object.assign(
        action.error ? { 
          error: {
            cause: action.error,
            message: "Log-in failed"
          }
        } : {}, state);

  }

}
