"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/middleware");

import assets from "./assets"
import { isAdmin, readLocalizedMessages } from "../core/utils"

import { BaseError } from "../core/errors"

export function registerMiddleware(app) {
  
  app.use(async (req, res, next) => {

    log.debug(`Access path ${req.path}`, req.query);
    
    if (req.query && req.query.nonce) {
      delete req.query.nonce;
    }

    if (req.path.substring(0, 2) === "/_") {
      return next();
    } else if (req.path.substring(0, 8) === "/main.js") {
      return next();
    } else if (req.path.substring(0, 4) === "/api") {
      return next();
    }

    log.debug(`Use middleware [locale=${req.locale}, auth=${req.isAuthenticated()}]`);
    GLOBAL.navigator = { userAgent: req.headers["user-agent"] };     
    
    let statusCode = 200;
    const data = { 
      title: "",
      description: "",
      css: "",
      body: "",
      entry: assets.main.js 
    };
    
    const common = {};
    if (req.session.error) {
      common.error = req.session.error;
      delete req.session.error;
    }

    let messages = await readLocalizedMessages(req.locale);
    if (!messages) {
      messages = await readLocalizedMessages("en");
    }

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
      const user = req.user.json();
      user.isAdmin = isAdmin(user.email);
      context.initialState.auth = {
        user: user
      };
    }

    req.context = context;
    req.data = data;
        
    console.log("middleware >>> next", req.context.initialState);
    next();

  });

}

export function registerErrorHandlers(app) {
  
  app.use("/", (err, req, res, next) => {
    
    console.log("BASIC ERROR", err);
    if (!err.id) {
      err = new BaseError(err);
    }
     
    if (err.id && err.id === "missing_provider_data") {
      if (err.data.method === "Facebook") {
        err.message = "Emme saaneet sähköpostiosoitettasi Facebookilta. Tieto voi puuttua tai et ole antanut lupaa sen luovuttamiseen. Sähköposti on pakollinen rekisteröintitieto. Voit kokeilla rekisteröitymistä Google-tunnuksilla tai sähköpostin ja salasanan yhdistelmällä.";
      } else if (err.data.method === "Google") {
        err.message = "Emme saaneet sähköpostiosoitettasi Googlelta. Tieto voi puuttua tai et ole antanut lupaa sen luovuttamiseen. Sähköposti on pakollinen rekisteröintitieto. Voit kokeilla rekisteröitymistä Facebook-tunnuksilla tai sähköpostin ja salasanan yhdistelmällä.";
      }

      req.session.error = err;
      return res.redirect("/login");
    }

    next(err);   
  
  });

  app.use("/api", (err, req, res, next) => {
    
    console.log("ERROR!!!", err);
    if (!err.id) {
      err = new BaseError(err);
    }
    
    res.status(err.statusCode).json({ status: "error", error: err });
  
  });

}
