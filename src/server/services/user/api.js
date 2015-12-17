"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/service/user/api");

import routeFilters from "../../routeFilters";
import { NotFound, BaseError } from "../../../core/errors";

export function registerRoutes(app) {

  let { User } = app.entities;
  let { requireAuth } = routeFilters(app);
  
  app.get("/api/user/:uuid", requireAuth, async (req, res, next) => {

    try {
      
      const user = await User.schema.findByUuid(req.params.uuid)
      if (!user) {
        return next(new NotFound(null, "user_not_found"));
      }
      
      res.json({ status: "ok", user: user.json() });

    } catch (err) {
      next(err);
    }
  
  });

  app.post("/api/user", (req, res, next) => {
    
    let user = req.body;
    User.schema.create(user).then((createdUser) => {
      res.json({ status: "ok", user: createdUser.json() });
    })
    .catch((err) => {
      next(err);
    });
  
  });

}
