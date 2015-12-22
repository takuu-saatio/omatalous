"use strict";

export function requireAuth(req, res, next) {
      
    if (!req.isAuthenticated()) {
      return res.redirect("/denied"); 
    }

    next();

}
