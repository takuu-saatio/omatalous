"use strict";

import * as actions from "../actions/auth";

export default function (state = {}, action) {
  
  state = Object.assign({}, state);
  state.error = null;
  
  //console.log("action", action);
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return { user: action.user };
    case actions.LOGOUT_SUCCESS:
      state.user = null;
      return state;
    default:
      return Object.assign(state, action.error ? { 
          error: {
            cause: action.error,
            message: "Log-in failed"
          }
      } : {});

  }

}
