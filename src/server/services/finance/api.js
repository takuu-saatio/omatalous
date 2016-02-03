"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/service/finance/api");

import { requireAuth } from "../../apiFilters";
import { BaseError, Forbidden } from "../../../core/errors";
import { isAdmin } from "../../../core/utils";

function allowedAccess(uuid, req) {
  return uuid === req.user.uuid || isAdmin(req.user.email);
}

export function registerRoutes(app) {

  app.get("/api/finance/transactions/:user?", requireAuth, 
          async (req, res, next) => {
    
    if (!allowedAccess(req.params.user, req)) {
      return next(new Forbidden());
    }

    try {
      
      let user = req.params.user || req.user.uuid;
      const { finance } = app.services;
      let params = req.query;
      let order = null;
      if (params) {
        
        if (params.repeats) {
          if (params.repeats === "1") {
            params.type = "repeating";
          } else if(params.repeats === "0") {
            params.$or = [
              { type: "single" },
              { type: "copy" }
            ];
          }
          delete params.repeats;
        }
        
        if (params.type === "planned") {
          order = "\"month\" ASC";
        }
     
      }
      
      let transactions = await finance.getTransactions(user, params, order);
      transactions = transactions.map(transaction => transaction.json());
      res.json({ status: "ok", transactions });
      
    } catch (err) {
      next(err);
    }
 
  });

  app.get("/api/finance/transactions/:user/:uuid", requireAuth, 
          async (req, res, next) => {
    
    if (!allowedAccess(req.params.user, req)) {
      return next(new Forbidden());
    }

    try {
      
      let user = req.params.user || req.user.uuid;
      user = isAdmin(req.user.email) ? "admin" : user;
      const { finance } = app.services;
      const transaction = await finance.getTransaction(user, req.params.uuid);
      res.json({ status: "ok", transaction: transaction.json() });
      
    } catch (err) {
      next(err);
    }
 
  });
  
  app.post("/api/finance/transactions/:user?", requireAuth, 
          async (req, res, next) => {
    
    if (!allowedAccess(req.params.user, req)) {
      return next(new Forbidden());
    }

    try {
      
      let user = req.params.user || req.user.uuid;
      const { finance } = app.services;
      const result = await finance.saveTransaction(user, req.body);
      res.json(Object.assign({ status: "ok" }, result));
      
    } catch (err) {
      next(err);
    }
 
  });
  
  app.delete("/api/finance/transactions/:user/:uuid", requireAuth, 
          async (req, res, next) => {
    
    try {
      
      let user = req.params.user || req.user.uuid;
      user = isAdmin(req.user.email) ? "admin" : user;
      const { finance } = app.services;
      const result = await finance.deleteTransaction(user, req.params.uuid);
      res.json({ status: "ok" });
      
    } catch (err) {
      next(err);
    }
 
  });
  
  app.get("/api/finance/goals/:user?", requireAuth, 
          async (req, res, next) => {
    
    if (!allowedAccess(req.params.user, req)) {
      return next(new Forbidden());
    }

    try {
      
      let user = req.params.user || req.user.uuid;
      const { finance } = app.services;
      let goals = await finance.getGoals(user);
      goals = goals.map(goal => goal.json());
      res.json({ status: "ok", goals });
      
    } catch (err) {
      next(err);
    }
 
  });
 
  app.post("/api/finance/goals/:user?", requireAuth, 
          async (req, res, next) => {
    
    if (!allowedAccess(req.params.user, req)) {
      return next(new Forbidden());
    }

    try {
      
      let user = req.params.user || req.user.uuid;
      const { finance } = app.services;
      const result = await finance.saveGoal(user, req.body);
      res.json(Object.assign({ status: "ok" }, result));
      
    } catch (err) {
      next(err);
    }
 
  });
  
  app.delete("/api/finance/goals/:user/:uuid", requireAuth, 
          async (req, res, next) => {
    
    try {
      
      let user = req.params.user || req.user.uuid;
      user = isAdmin(req.user.email) ? "admin" : user;
      const { finance } = app.services;
      const result = await finance.deleteGoal(user, req.params.uuid);
      res.json({ status: "ok" });
      
    } catch (err) {
      next(err);
    }
 
  });
  
  app.get("/api/finance/month/:user?", requireAuth, 
          async (req, res, next) => {
    
    if (!allowedAccess(req.params.user, req)) {
      return next(new Forbidden());
    }

    try {
      
      let user = req.params.user || req.user.uuid;
      const { finance } = app.services;

      const monthStats = await finance.getCurrentMonthStats(user);
      res.json({ status: "ok", monthStats });
      
    } catch (err) {
      next(err);
    }
 
  });
  
  app.get("/api/finance/categories/:user?", requireAuth, 
          async (req, res, next) => {
    
    if (!allowedAccess(req.params.user, req)) {
      return next(new Forbidden());
    }

    try {
      
      let user = req.params.user || req.user.uuid;
      const { finance } = app.services;
      const params = req.query && req.query.all ?
        { $or: [ { user: { $eq: null } }, { user } ] } : null;
      let categories = await finance.getCategories(user, params);
      categories = categories.map(category => category.json());
      res.json({ status: "ok", categories });
      
    } catch (err) {
      next(err);
    }
 
  });

  app.post("/api/finance/categories/:user?", requireAuth, 
          async (req, res, next) => {
    
    if (!allowedAccess(req.params.user, req)) {
      return next(new Forbidden());
    }

    try {
      
      const { finance } = app.services;      
      let user = req.params.user || req.user.uuid; 
      const result = await finance.saveCategory(user, req.body);
      res.json(Object.assign({ status: "ok" }, result));
      
    } catch (err) {
      next(err);
    }
 
  });
  
  app.delete("/api/finance/categories/:user/:uuid", requireAuth, 
          async (req, res, next) => {
    
    try {
      
      let user = req.params.user || req.user.uuid;
      user = isAdmin(req.user.email) ? "admin" : user;
      const { finance } = app.services;
      const result = await finance.deleteCategory(user, req.params.uuid);
      res.json({ status: "ok" });
      
    } catch (err) {
      next(err);
    }
 
  });

} 
