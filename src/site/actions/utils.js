"use strict";

export function processResponse(response, successType, failType) {
 
  if (response.error) {
    return {
      type: failType,
      error: response.error
    };
  } else {
    return {
      type: successType
    };
  }

}
