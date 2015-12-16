"use strict";

import * as actions from "../actions/auth";

export default function (state = {}, action) {
  
  delete state.error;
    
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return Object.assign(state, { user: action.user });
    case actions.LOGOUT_SUCCESS:
      delete state.user;
      return state;
    default:
      if (action.error) {
        return Object.assign({ error: action.error });
      }

  }

}
