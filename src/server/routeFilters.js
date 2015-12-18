"use strict";

import { BaseError, Forbidden } from "../core/errors";

export default function(app) {
  
  return {

    requireAuth: (req, res, next) => {
      
     console.log("req auth"); 
      app.passport.authenticate("local", (err, user, info) => {
        console.log("passport", err, user, info);
        return next();
      });
      
      /*
      app.services.auth.screenRequest(req)
      .then((auth) => {
        next();
      })
      .catch((err) => {
        next(err);
        });
        */

    }

  } 

}
