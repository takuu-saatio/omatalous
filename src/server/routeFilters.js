"use strict";

import { BaseError, Forbidden } from "../core/errors";

export default function(app) {
  
  return {

    requireAuth: (req, res, next) => {
      
      app.services.auth.screenRequest(req)
      .then((auth) => {
        next();
      })
      .catch((err) => {
        next(err);
      });

    }

  } 

}
