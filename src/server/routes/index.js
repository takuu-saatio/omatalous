import React from "react";
import Router from "react-routing/src/Router";
import http from "../../core/HttpClient";
import App from "../../components/App";
import ContactPage from "../../components/ContactPage";
import RegisterPage from "../../components/RegisterPage";
import NotFoundPage from "../../components/NotFoundPage";
import ErrorPage from "../../components/ErrorPage";

import CounterApp from "../../containers/App";
import LoginPage from "../../containers/LoginPage";
import ContentPage from "../../containers/ContentPage";

const router = new Router(on => {
  
  on("*", async (state, next) => {
    const component = await next();
    console.log("app state", state); 
    return component && <App context={state.context}>{component}</App>;
  });

  on("/contact", async () => <ContactPage />); 
  on("/counter", async () => <CounterApp />);
  on("/login", async () => <LoginPage />);
  on("/register", async () => <RegisterPage />);
  on("/about", async () => <ContentPage />);
  
  /*
  on("*", async (state) => {
    console.log("loading content: ", state.path);
    const source = await http.get(`/api/content?path=${state.path}`);
    let data = {
      path: state.path,
      content: source,
      title: state.path
    };
    console.log("returning content");
    return <ContentPage {...data} />;
  });
  */

  on("error", (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error}><NotFoundPage /></App> :
    <App context={state.context} error={error}><ErrorPage /></App>
  );

});

export function registerRoutes(app) {
  
  app.get("/login", (req, res, next) => {
    
    req.context.initialState = { login: "initialized" }; 
    req.context.reducers = [ "login" ];

    app.renderPage(req, res);
    
  });
  
  app.get("/about", (req, res, next) => {

    req.context.initialState = { about: { title: "ABOUT", content: "bla blah" } }; 
    req.context.reducers = [ "about" ];
    
    app.renderPage(req, res);
  
  });

}

export default router
