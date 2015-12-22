"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/service/user/api");

import { requireAuth } from "../../apiFilters";
import { NotFound, Forbidden, BaseError } from "../../../core/errors";

export function registerRoutes(app) {

  let { User } = app.entities;
   
  app.get("/api/users", requireAuth, async (req, res, next) => {
    
    if (req.user.email !== "vhalme@gmail.com") {
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
 
    if (req.params.uuid !== req.user.uuid && req.user.email !== "vhalme@gmail.com") {
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
    if (user.uuid !== req.user.uuid && req.user.email !== "vhalme@gmail.com") {
      return next(new Forbidden());
    }

    try {
      
      const userService = app.services.user;
    
      await userService.saveUser(user);
      res.json({ status: "ok" });

    } catch (err) {
      next(err);
    }
  
  });

}
