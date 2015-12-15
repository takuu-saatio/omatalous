import "babel-core/polyfill";
import log4js from "log4js";
const log = log4js.getLogger("server");

import path from "path";
import express from "express";
import bodyParser from "body-parser";
import Sequelize from "sequelize";
import React from "react";
import ReactDOM from "react-dom/server";
import Router from "./site/router";
import { registerRoutes as registerApiRoutes } from "./routes/api";
import { registerRoutes as registerSiteRoutes } from "./routes/site";
import { registerMiddleware, registerErrorHandlers } from "./server/middleware";
import Html from "./site/components/Html";
import SchemaLoader from "./server/schema/SchemaLoader";

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

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

registerMiddleware(app);
registerSiteRoutes(app);
registerApiRoutes(app);
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
      data.reducers = context.reducers;
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
