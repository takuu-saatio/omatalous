"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/routes");

import { readContent } from "../../core/utils";
import { Unauthorized } from "../../core/errors";

export function registerRoutes(app) {
  
  app.get("/home", (req, res, next) => {
    
    const homeState = {
      homeVal: "abc"
    };

    if (req.session.newUser) {
      homeState.newUser = true;
      delete req.session.newUser;
    }

    console.log("home initial", req.context.initialState);
    req.context.initialState = Object.assign(req.context.initialState, { home: homeState });

    app.renderPage(req, res);
    
  });

  app.get("/login", (req, res, next) => { 
    app.renderPage(req, res);
  });
   
  app.get("/login/fb", app.passport.authenticate("login-facebook", { scope: ["email"] }));
  
  app.get("/login/fb/callback", app.passport.authenticate("login-facebook"), (req, res, next) => { 
    
    if (!req.user) {
      return next(new Unauthorized(null, "fb_callback_failed"));
    }

    if (req.user.isNew) {
      req.session.newUser = true;
    }
    
    res.redirect("/home");

  });

  app.get("/login/google", app.passport.authenticate("login-google", { scope: ["email"] }));
  
  app.get("/login/google/callback", app.passport.authenticate("login-google"), (req, res, next) => { 
 
    if (!req.user) {
      return next(new Unauthorized(null, "req_callback_failed"));
    }

    if (req.user.isNew) {
      req.session.newUser = true;
    }
    
    res.redirect("/home");
    
  });

  app.get("/logout", (req, res, next) => { 
    req.logout();
    res.redirect("/home");
  });

  app.get(/^(\/(?!_))(?!api\/?)/i, async (req, res, next) => {
        
    try {
    
      const content = await readContent(req.path);
       
      if (content.error) {
        return next(content.error);
      }
      
      req.context.initialState = {
        content: Object.assign(content.data, { iso: true })
      };

      app.renderPage(req, res);

    } catch(err) {
      console.log(err);
      next({ error: err });
    } 

  });
    

}
