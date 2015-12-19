"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/service/auth/api");

import { BaseError } from "../../../core/errors";

export function registerRoutes(app) {

  app.get("/api/auth/:token?", async (req, res, next) => {
    
    try {
       
      const { auth } = app.services;
      const result = await auth.screenRequest(req);
      res.json({ status: "ok", auth: result });
      
    } catch (err) {
      next(err);
    }
 
  });
  
  app.post("/api/login/pwd", app.passport.authenticate("login-local"), (req, res, next) => { 
    res.json({ status: "ok" });
  });
  
  app.get("/api/login/fb", 
          app.passport.authenticate("login-facebook", { scope: ["email"] }), 
          (req, res, next) => { 
    res.json({ status: "ok" });
  });
  
  app.get("/api/login/fb/callback", app.passport.authenticate("login-facebook"), (req, res, next) => { 
    res.json({ status: "ok-auth" });
  });

  app.post("/api/register", app.passport.authenticate("register-local"), (req, res, next) => {
    res.json({ status: "ok" });
  });
  
  app.get("/api/logout", (req, res, next) => { 
    req.logout();
    res.json({ status: "ok-logout" });
  });

}
