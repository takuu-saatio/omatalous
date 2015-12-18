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
  
  app.get("/api/test", async (req, res, next) => {
    
    console.log("testing api");
    app.passport.authenticate("login-pwd", (err, user, info) => {
      console.log("passport-login", err, user, info);
      return next();
    });
    
    res.json({ status: "ok" }); 

  });

  
}
