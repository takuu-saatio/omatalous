import "babel-core/polyfill";
import path from "path";
import express from "express";
import React from "react";
import ReactDOM from "react-dom/server";
import Router, { registerRoutes } from "./server/routes";
import * as apiRoutes from "./server/routes/api";
import { registerMiddleware } from "./server/middleware";
import Html from "./components/Html";

const app = global.app = express();
const port = process.env.PORT || 5000;
app.set("port", port);

app.use(express.static(path.join(__dirname, "public")));

registerMiddleware(app);
registerRoutes(app);
apiRoutes.registerRoutes(app);

app.use("/api/content", require("./api/content"));

app.renderPage = async (req, res) => {
  
    let statusCode = 200;
    const data = req.data;
    const context = req.context;
    console.log("dispatching route");
    await Router.dispatch({ path: req.path, context }, (state, component) => {
      console.log("returned state", state);
      console.log("rendering to string", component);
      data.body = ReactDOM.renderToString(component);
      data.css = context.css.join("");
      console.log("dispatch complete");
    });
    
    console.log("finished back-end rendering content");
    data.initialState = context.initialState;
    data.reducers = context.reducers;
    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(context.statusCode).send("<!doctype html>\n" + html);

}

app.listen(port, () => {
  console.log(`The app is running at http://localhost:${port}/`);
});
