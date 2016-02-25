"use strict";

import http from "../tools/http-client";
import { processResponse } from "./utils";

export const STATS_FETCH_SUCCESS = "STATS_FETCH_SUCCESS";
export const STATS_FETCH_FAIL = "STATS_FETCH_FAIL";

export function fetchGraphStats(user, params) {
  
  return async (dispatch) => {
    
    let response = await http.get(`/api/stats/graphs/${user}`, params);
    const action = processResponse(response, STATS_FETCH_SUCCESS, STATS_FETCH_FAIL);
    
    if (action.type === STATS_FETCH_SUCCESS) {
      
      action.stats = response.stats; 

      response = await http.get(`/api/finance/categories/${user}`);
      if (response.categories) {
        action.categories = response.categories;
      }
    
    }

    dispatch(action);
  
  };

}
