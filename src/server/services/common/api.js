"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/service/common/api");

import { readContent } from "../../../core/utils";
import { NotFound, BaseError } from "../../../core/errors";

export function registerRoutes(app) {

  app.get("/api/content/:path", async (req, res, next) => {
    
    try {
      
      const content = await readContent(req.params.path);

      if (content.error) {
        return next(content.error);
      }

      res.json({ status: "ok", content: content.data });

    } catch (err) {
      next(err);
    }

  });
  

  app.get("/api/test", (req, res, next) => {
    console.log("is auth", req.isAuthenticated());
    console.log("req user", req.user);
    res.json({ test: "ok" });
  });
  
  app.get("/api/logout", (req, res, next) => {
    console.log("user", req.user);
    req.logout();
    res.json({ test: "ok" });
  });

  
}
