"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/middleware");

import assets from "./assets.json"
import { readLocalizedMessages } from "../core/utils"

import { BaseError } from "../core/errors"

export function registerMiddleware(app) {
  
  app.use(async (req, res, next) => {

    log.debug(`Access path ${req.path}`);
        
    if (req.path.substring(0, 2) === "/_") {
      return next();
    } else if (req.path.substring(0, 4) === "/api") {
      return next();
    }

    log.debug(`Use middleware [locale=${req.locale}, auth=${req.isAuthenticated()}]`);
     
    let statusCode = 200;
    const data = { 
      title: "",
      description: "",
      css: "",
      body: "",
      entry: assets.app.js 
    };
    
    const common = {};
    if (req.session.error) {
      common.error = req.session.error;
      delete req.session.error;
    }

    const messages = await readLocalizedMessages(req.locale);
    const context = {
      intlData: { 
        locales: ["en-US"],
        messages: messages
      },
      initialState: {},
      common: common,
      reducers: [],
      css: [],
      statusCode: 200,
      insertCss: styles => context.css.push(styles._getCss()),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => context.statusCode = 404
    };
  
    log.debug("req authorized", req.isAuthenticated());

    if (req.isAuthenticated()) {
      context.initialState.auth = {
        user: req.user.json()
      };
    }

    req.context = context;
    req.data = data;
        
    console.log("middleware >>> next", req.context.initialState);
    next();

  });

}

export function registerErrorHandlers(app) {
  
  app.use("/api", (err, req, res, next) => {
    
    console.log("ERROR!!!", err);
    if (!err.id) {
      err = new BaseError(err);
    }
    
    res.status(err.statusCode).json({ status: "error", error: err });
  
  });

}
