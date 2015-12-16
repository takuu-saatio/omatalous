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
  
  app.post("/api/login", async (req, res, next) => {

    try {
      
      const { auth } = app.services;
      
      const loginParams = req.body;
      const result = await auth.login(loginParams);
      res.json({ status: "ok", login: result });

    } catch (err) {
      next(err);
    }
      
  });

  app.post("/api/register", async (req, res, next) => {

    try {
      
      const { auth } = app.services;
      
      const regParams = req.body;
      const result = await auth.register(regParams);
      res.json({ status: "ok", registration: result });

    } catch (err) {
      next(err);
    }
    
  });

}
