"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/service/stats/api");

import { requireAuth } from "../../apiFilters";
import { BaseError, Forbidden } from "../../../core/errors";
import { isAdmin } from "../../../core/utils";

function allowedAccess(uuid, req) {
  return uuid === req.user.uuid || isAdmin(req.user.email);
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
      const graphStats = await stats.getGraphStats(user, req.query);
      res.json({ status: "ok", stats: graphStats });
      
    } catch (err) {
      next(err);
    }
 
  });
  
  app.get("/api/stats/admin", requireAuth,
    async (req, res, next) => {
    
    if (!isAdmin(req.user.email)) {
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
