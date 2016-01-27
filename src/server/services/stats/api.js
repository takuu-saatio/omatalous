"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/service/stats/api");

import { requireAuth } from "../../apiFilters";
import { BaseError } from "../../../core/errors";

function allowedAccess(uuid, req) {
  return uuid === req.user.uuid || req.user.email === process.env.ADMIN_USER;
}

export function registerRoutes(app) {

  app.get("/api/stats/graphs/:user?", requireAuth,
    async (req, res, next) => {
    
    if (!allowedAccess(req.params.user, req)) {
      return next(new Forbidden());
    }

    try {
       
      let user = req.params.user || req.user.uuid;
      const { stats } = app.services;
      const graphStats = await stats.getGraphStats(user);
      res.json({ status: "ok", stats: graphStats });
      
    } catch (err) {
      next(err);
    }
 
  });
  
  app.get("/api/stats/admin", requireAuth,
    async (req, res, next) => {
      
    if (process.env.ADMIN_USER.indexOf(req.user.email) === -1) {
      return next(new Forbidden());
    }

    try {
       
      const { stats } = app.services;
      const regStats = await stats.getRegistrationStats();
      res.json({ status: "ok", registrations: regStats });
      
    } catch (err) {
      next(err);
    }
 
  });
   
}
