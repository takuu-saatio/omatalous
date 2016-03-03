"use strict";

import "babel-core/polyfill";
import log4js from "log4js";
const log = log4js.getLogger("server");

import path from "path";
import express from "express";
import locale from "locale";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import expressSession from "express-session";
import Sequelize from "sequelize";
import React from "react";
import ReactDOM from "react-dom/server";
import confPassport from "./server/passport";
import Router from "./site/router";
import { registerRoutes as registerSiteRoutes } from "./site/routes";
import { registerMiddleware, registerErrorHandlers } from "./server/middleware";
import Html from "./site/components/Html";
import SchemaLoader from "./server/schema/SchemaLoader";

import { LocalAuthServiceInterface } from "./services/auth";
import { LocalUserServiceInterface } from "./services/user";
import { LocalFinanceServiceInterface } from "./services/finance";
import { LocalStatsServiceInterface } from "./services/stats";
import { HttpCommonServiceInterface } from "./services/common";

const app = global.server = express();

import assets from './assets';
//import { port } from './config';
const port = process.env.PORT || 5000;

const dbUser = process.env.DB_USER || "omatalous";
const dbPassword = process.env.DB_PASSWORD || "omatalous";
app.sequelize = new Sequelize("omatalous", dbUser, dbPassword, {  
  host: process.env.DB_HOSTNAME || process.env.PG_PORT_5432_TCP_ADDR || "localhost",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

app.schemaLoader = new SchemaLoader(app.sequelize);
app.entities = {
  User: app.schemaLoader.loadSchema("User"),
  Transaction: app.schemaLoader.loadSchema("Transaction"),
  Copy: app.schemaLoader.loadSchema("Copy"),
  Goal: app.schemaLoader.loadSchema("Goal"),
  Alert: app.schemaLoader.loadSchema("Alert"),
  Event: app.schemaLoader.loadSchema("Event"),
  Category: app.schemaLoader.loadSchema("Category")
};

const passport = require("passport");
app.passport = passport;

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(cookieParser());
app.use(bodyParser());
app.use(expressSession({ secret: "keyboard cat" }));
app.use(app.passport.initialize());
app.use(app.passport.session());
app.use(locale(["en", "fi"]));
app.use(express.static(path.join(__dirname, "public")));

registerMiddleware(app);
registerSiteRoutes(app);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
/*
app.get('*', async (req, res, next) => {
  app.renderPage(req, res, next);
});
*/

app.services = {
  auth: new LocalAuthServiceInterface(app, { 
    provideService: true, provideRoutes: true 
  }),
  user: new LocalUserServiceInterface(app, { 
    provideService: true, provideRoutes: true 
  }),
  finance: new LocalFinanceServiceInterface(app, { 
    provideService: true, provideRoutes: true 
  }),
  stats: new LocalStatsServiceInterface(app, { 
    provideService: true, provideRoutes: true 
  }),
  common: new HttpCommonServiceInterface(app, { provideRoutes: true })
};

confPassport(app);
registerErrorHandlers(app);

app.renderPage = async (req, res, next) => {
   
    try {
          
      const data = req.data;
      const context = req.context;
      log.debug("starting rendering page");
      
      await Router.dispatch({ path: req.path, context }, (state, component) => {
        data.body = ReactDOM.renderToString(component);
        data.css = context.css.join("");
      });

      log.debug("rendering output page");      
      data.initialState = context.initialState;
      data.intlData = context.intlData;
      data.userAgent = req.headers["user-agent"];
      const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
      res.status(context.statusCode).send("<!doctype html>\n" + html);
    
    } catch(err) {
      log.debug(err);
      return next({ error: err });
    }
    

}

//
// Launch the server
// -----------------------------------------------------------------------------
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://local.omatalous.fi:${port}/`);
});
