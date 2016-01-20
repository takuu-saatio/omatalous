"use strict";

import http from "../tools/http-client";
import { processResponse } from "./utils";

export const STATS_FETCH_SUCCESS = "STATS_FETCH_SUCCESS";
export const STATS_FETCH_FAIL = "STATS_FETCH_FAIL";

export function fetchGraphStats(user) {
  
  return async (dispatch) => {
    
    let response = await http.get(`/api/stats/graphs/${user}`);
    const action = processResponse(response, STATS_FETCH_SUCCESS, STATS_FETCH_FAIL);
    
    if (action.type === STATS_FETCH_SUCCESS) {
      action.stats = response.stats; 
    }

    dispatch(action);
  
  };

}
