"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/routes/api");

import { readContent } from "../../core/utils";

export function registerRoutes(app) {

  let { User } = app.entities;

  app.get("/api/user/:uuid", (req, res, next) => {
    
    User.schema.findByUuid(req.params.uuid)
    .then((user) => {

      if (!user) {
        return next({ err: "notfound" });
      }

      res.json({ status: "ok", user: user.json() });
    
    })
    .catch((err) => {
      next({ err: err });
    });

  
  });
  
  app.post("/api/user", (req, res, next) => {
    
    let user = req.body;
    User.schema.create(user).then((createdUser) => {
      res.json({ status: "ok", user: createdUser.json() });
    })
    .catch((err) => {
      log.debug("err", err);
    });
  
  });

  app.get("/api/login", (req, res, next) => {

    let loginState = { status: "apival" };
    res.json({ status: "ok", login: loginState });
      
  });

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


}
