"use strict";

import * as actions from "../actions/GraphsActions";

export default function (state = {}, action) {
  
  state = Object.assign({}, state);
  state.error = null;
  state.messages = null;
  
  switch (action.type) {
    case actions.STATS_FETCH_SUCCESS:
      return { stats: action.stats, categories: action.categories, isUpdated: true };
    case actions.STATS_FETCH_FAIL:
      return { error: action.error, isUpdated: true };
    default:
      state.pass = true;
      return state;
  }

}
