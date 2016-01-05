"use strict";

import * as actions from "../actions/recovery";

export default function (state = {}, action) {
  
  state = {};

  //console.log("action", action);
  switch (action.type) {
    case actions.RECOVERY_SUCCESS:
      return { status: "email_sent" };
    case actions.RECOVERY_FAIL:
      return { error: action.error };
    default:
      return state;
  }

}
