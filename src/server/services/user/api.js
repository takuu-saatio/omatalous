"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/service/user/api");

import { requireAuth, requireOwnership } from "../../apiFilters";
import { NotFound, Forbidden, BaseError } from "../../../core/errors";

function allowedToEdit(uuid, req) {
  return uuid === req.user.uuid || req.user.email === process.env.ADMIN_USER;
}

export function registerRoutes(app) {

  let { User } = app.entities;
   
  app.get("/api/users", requireAuth, async (req, res, next) => {
    
    if (!allowedToEdit(null, req)) {
      return next(new Forbidden());
    }

    try {
      const userService = app.services.user;
      let users = await userService.getUsers();
      users = users.map(user => user.json());
      res.json({ status: "ok", users: users });
    } catch (err) {
      next(err);
    }

  });

  app.get("/api/users/:uuid", requireAuth, async (req, res, next) => {
 
    if (!allowedToEdit(req.params.uuid, req)) {
      return next(new Forbidden());
    }

    try {
    
      const userService = app.services.user;
      const user = await userService.getUser(req.params.uuid)
      res.json({ status: "ok", user: user.json() });

    } catch (err) {
      next(err);
    }
  
  });

  app.put("/api/users", requireAuth, async (req, res, next) => {

    const user = req.body;
    if (!allowedToEdit(user.uuid, req)) {
      return next(new Forbidden());
    }

    try {
      
      const userService = app.services.user;
    
      let result = await userService.saveUser(user);
      res.json({ status: "ok", pwdChanged: result.pwdChanged });

    } catch (err) {
      next(err);
    }
  
  });
  
  app.delete("/api/users/:uuid", requireAuth, async (req, res, next) => {

    if (!allowedToEdit(req.params.uuid, req)) {
      return next(new Forbidden());
    }

    try {
      
      const userService = app.services.user; 
      await userService.deleteUser(req.params.uuid);
      res.json({ status: "ok" });

    } catch (err) {
      next(err);
    }
  
  });

}
