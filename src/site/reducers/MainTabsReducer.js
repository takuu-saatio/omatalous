"use strict";

import * as actions from "../actions/MainTabsActions";

export default function (state = {}, action) {
  
  switch (action.type) {
    case actions.TAB_CHANGED:
      return { tab: action.tab };
    default:
      return { tab: 0 };
  }

}
