import "babel-core/polyfill";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import Sequelize from "sequelize";
import React from "react";
import ReactDOM from "react-dom/server";
import Router, { registerRoutes } from "./server/routes";
import * as apiRoutes from "./server/routes/api";
import { registerMiddleware, registerErrorHandlers } from "./server/middleware";
import Html from "./components/Html";
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
registerRoutes(app);
apiRoutes.registerRoutes(app);
registerErrorHandlers(app);

app.use("/api/content", require("./api/content"));

app.renderPage = async (req, res) => {
  
    let statusCode = 200;
    const data = req.data;
    const context = req.context;
    await Router.dispatch({ path: req.path, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = context.css.join("");
    });
    
    data.initialState = context.initialState;
    data.reducers = context.reducers;
    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(context.statusCode).send("<!doctype html>\n" + html);

}

app.listen(port, () => {
  console.log(`The app is running at http://localhost:${port}/`);
});
