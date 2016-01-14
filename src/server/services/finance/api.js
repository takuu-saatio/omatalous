"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/service/finance/api");

import { requireAuth } from "../../apiFilters";
import { BaseError, Forbidden } from "../../../core/errors";

function allowedAccess(uuid, req) {
  return uuid === req.user.uuid || req.user.email === process.env.ADMIN_USER;
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
      let transactions = await finance.getTransactions(user, req.query);
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
      user = req.user.email === process.env.ADMIN_USER ? "admin" : user;
      const { finance } = app.services;
      const transaction = await finance.getTransaction(user, req.params.uuid);
      res.json({ status: "ok", transaction });
      
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
      user = req.user.email === process.env.ADMIN_USER ? "admin" : user;
      const { finance } = app.services;
      const result = await finance.deleteTransaction(user, req.params.uuid);
      res.json({ status: "ok" });
      
    } catch (err) {
      next(err);
    }
 
  });

} 
