import "babel-core/polyfill";
import path from "path";
import express from "express";
import React from "react";
import ReactDOM from "react-dom/server";
import Router from "./routes";
import serverRoutes from "./server/routes";
import Html from "./components/Html";
import assets from "./assets.json";

import configureStore from "./stores/configureStore";

const app = global.app = express();
const port = process.env.PORT || 5000;
app.set("port", port);

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/content", require("./api/content"));

app.use("*", async (req, res, next) => {
  
  console.log("use middleware");
  
  let statusCode = 200;
  const data = { 
    title: "",
    description: "",
    css: "",
    body: "",
    entry: assets.app.js 
  };
  
  const css = [];
  const context = {
    insertCss: styles => css.push(styles._getCss()),
    onSetTitle: value => data.title = value,
    onSetMeta: (key, value) => data[key] = value,
    onPageNotFound: () => statusCode = 404
  };

  req.context = context;
  req.data = data;
  req.css = css;
    
  console.log("middleware >>> next");
  next();

});

serverRoutes(app);

app.renderPage = async (req, res) => {
  
    let statusCode = 200;
    const data = req.data;
    const css = req.css;
    const context = req.context;
    await Router.dispatch({ path: req.path, context }, (state, component) => {
      console.log("returned state", state);
      data.body = ReactDOM.renderToString(component);
      data.css = css.join("");
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send("<!doctype html>\n" + html);

}

app.listen(port, () => {
  console.log(`The app is running at http://localhost:${port}/`);
});
