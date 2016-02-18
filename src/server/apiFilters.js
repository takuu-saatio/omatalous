"use strict";

import { BaseError, Forbidden } from "../core/errors";

export function requireAuth(req, res, next) {
  
  if (!req.isAuthenticated()) {
    return next(new Forbidden(null, "auth_failed")); 
  }

  next();

}
