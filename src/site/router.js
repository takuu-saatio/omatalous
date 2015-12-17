import React from "react";
import Router from "react-routing/src/Router";
import http from "../core/HttpClient";
import container from "./container";

import App from "./components/App";

import LoginPage from "./components/LoginPage";
import * as LoginActions from "./actions/login";

import * as AuthActions from "./actions/auth";

import Test from "./components/Test/Test";
import * as TestActions from "./actions/test";

import ContentPage from "./components/ContentPage";
import NotFoundPage from "./components/NotFoundPage";
import ErrorPage from "./components/ErrorPage";

const TestContainer = container(Test, TestActions, "test");
const LoginContainer = container(LoginPage, AuthActions, "auth");
const ContentContainer = container(ContentPage, {}, "content");

export default new Router(on => {
  
  on("*", async (state, next) => {
    
    const component = await next();
    let intlData = state.context.intlData;
    console.log("intl data", intlData);
    /*
    intlData = {
      locales: ["en-US"],
      messages: {
        hello_world: "Hello, world!!!"
      }
      };
      */
    return component && <App context={state.context} {...intlData}>{component}</App>;
  
  });

  on("/test", () => <TestContainer />);
  on("/login", () => <LoginContainer />);
  on("*", (state) => {
    return <ContentContainer path={state.path} />
  });
  
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