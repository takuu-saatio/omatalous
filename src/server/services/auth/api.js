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
   
  app.post("/api/auth/recover", async (req, res, next) => {
    
    try {
       
      const { auth } = app.services;
      const result = await auth.sendRecoveryLink(req.body);
      res.json({ status: "ok" });
      
    } catch (err) {
      next(err);
    }
 
  });

}
