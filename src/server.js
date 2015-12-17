import "babel-core/polyfill";
import log4js from "log4js";
const log = log4js.getLogger("server");

import path from "path";
import express from "express";
import locale from "locale";
import bodyParser from "body-parser";
import Sequelize from "sequelize";
import React from "react";
import ReactDOM from "react-dom/server";
import passport from "./server/passport";
import Router from "./site/router";
import { registerRoutes as registerSiteRoutes } from "./site/routes";
import { registerMiddleware, registerErrorHandlers } from "./server/middleware";
import Html from "./site/components/Html";
import SchemaLoader from "./server/schema/SchemaLoader";

import { LocalAuthServiceInterface } from "./services/auth";
import { HttpUserServiceInterface } from "./services/user";
import { HttpCommonServiceInterface } from "./services/common";

const app = global.app = express();
const port = process.env.PORT || 5000;
app.set("port", port);

app.sequelize = new Sequelize("omatalous", "omatalous", "omatalous", {  
  host: "localhost",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

app.schemaLoader = new SchemaLoader(app.sequelize);
app.entities = {
  User: app.schemaLoader.loadSchema("User")
};

app.passport = passport();

app.use(bodyParser.json());
app.use(locale(["en", "fi"]));
app.use(express.static(path.join(__dirname, "public")));

registerMiddleware(app);
registerSiteRoutes(app);

app.services = {
  auth: new LocalAuthServiceInterface(app, { 
    provideService: true, provideRoutes: true 
  }),
  user: new HttpUserServiceInterface(app, { provideRoutes: true }),
  common: new HttpCommonServiceInterface(app, { provideRoutes: true })
};

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
      const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
      res.status(context.statusCode).send("<!doctype html>\n" + html);
    
    } catch(err) {
      log.debug(err);
      return next({ error: err });
    }
    

}

app.listen(port, () => {
  console.log(`The app is running at http://localhost:${port}/`);
});
