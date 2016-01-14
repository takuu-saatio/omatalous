"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/routes");

import { readContent } from "../../core/utils";
import { requireAuth } from "../../server/siteFilters";
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

    req.context.initialState = Object.assign(req.context.initialState, { home: homeState });
    app.renderPage(req, res);
    
  });
 
  app.get("/account/:uuid?", requireAuth, async (req, res, next) => {

    try {
      
      const userService = app.services.user;

      const uuid = req.params.uuid || req.user.uuid;
      if (uuid !== req.user.uuid && req.user.email !== process.env.ADMIN_USER) {
        return res.redirect("/denied");
      }

      const user = await userService.getUser(uuid);

      const state = Object.assign({
        account: { account: user.json(), iso: true }
      }, req.context.common);
      
      req.context.initialState = Object.assign(req.context.initialState, state);
      app.renderPage(req, res);

    } catch (err) {
      next(err);
    }

  });
  
  app.get("/consumption/:user?", requireAuth, async (req, res, next) => {
    
    try {
      
      const financeService = app.services.finance;

      const user = req.params.user || req.user.uuid;
      if (user !== req.user.uuid && req.user.email !== process.env.ADMIN_USER) {
        return res.redirect("/denied");
      }

      let transactions = await financeService.getTransactions(user);
      transactions = transactions.map(transaction => transaction.json());
      const state = Object.assign({ 
        mainTabs: {
          tab: 0,
        },
        consumption: { transactions, iso: true }
      }, req.context.common);
      
      req.context.initialState = Object.assign(req.context.initialState, state);
      app.renderPage(req, res);

    } catch (err) {
      next(err);
    }

  });
  
  app.get("/admin", requireAuth, async (req, res, next) => {

    try {
      
      const userService = app.services.user;

      const uuid = req.params.uuid || req.user.uuid;
      if (req.user.email !== process.env.ADMIN_USER) {
        return res.redirect("/denied");
      }

      const users = await userService.getUsers();

      const state = Object.assign({
        admin: { accounts: users.map(user => user.json()), iso: true }
      }, req.context.common);
      
      req.context.initialState = Object.assign(req.context.initialState, state);
      app.renderPage(req, res);

    } catch (err) {
      next(err);
    }

  });

  app.post("/login", (req, res, next) => { 
     
    app.passport.authenticate("login-local", (err, user, info) => {
      
      if (err) {
        req.session.error = err;
        res.redirect("/login");
        return;
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        req.session.newUser = user.isNew;
        res.redirect("/home");
      });
    
    })(req, res, next);
    
  });

  app.get("/login/fb", app.passport.authenticate("login-facebook", { scope: ["email"] }));
  
  app.get("/login/fb/callback", app.passport.authenticate("login-facebook"), (req, res, next) => { 
    
    if (!req.user) {
      return next(new Unauthorized(null, "fb_callback_failed"));
    }

    req.session.newUser = req.user.isNew; 
    res.redirect("/home");

  });

  app.get("/login/google", app.passport.authenticate("login-google", { scope: ["email"] }));
  
  app.get("/login/google/callback", app.passport.authenticate("login-google"), (req, res, next) => { 
 
    if (!req.user) {
      return next(new Unauthorized(null, "req_callback_failed"));
    }

    req.session.newUser = req.user.isNew; 
    res.redirect("/home");
    
  });

  app.get("/logout", (req, res, next) => { 
    req.logout();
    res.redirect("/home");
  });

  app.get("/login/recovery", (req, res, next) => {
    const recoveryState = Object.assign({}, req.context.common);
    req.context.initialState = Object.assign(req.context.initialState, { 
      recovery: recoveryState, 
      routing: { path: "/login/recovery" } 
    });
    app.renderPage(req, res);
  });

  app.get("/login/:token?", (req, res, next) => {
    
    const loginState = Object.assign({}, req.context.common);
    loginState.token = req.params.token;
     
    req.context.initialState = Object.assign(req.context.initialState, { 
      login: loginState,
      routing: { path: "/login" } 
    });
    app.renderPage(req, res);
  
  });

  app.get(/^(\/(?!_))(?!api\/?)/i, async (req, res, next) => {
        
    try {
    
      const content = await readContent(req.path);
       
      if (content.error) {
        return next(content.error);
      }
      
      req.context.initialState = Object.assign(req.context.initialState, { 
        content: Object.assign(content.data, { iso: true })
      });
      
      app.renderPage(req, res);

    } catch(err) {
      next({ error: err });
    } 

  });
    

}
