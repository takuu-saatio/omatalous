"use strict";

export const TAB_CHANGED = "TAB_CHANGED";

export function changeTab(tab) {
  
  return async (dispatch) => {
    dispatch({ type: TAB_CHANGED, tab: tab });
  };

}
