import React from "react";
import Router from "react-routing/src/Router";
import http from "../core/HttpClient";
import container from "./container";

import App from "./components/App";

import HomeView from "./components/HomeView";
import * as HomeActions from "./actions/home";

import LoginView from "./components/LoginView";
import * as LoginActions from "./actions/login";
import LoginRecoveryView from "./components/LoginRecoveryView";
import * as LoginRecoveryActions from "./actions/recovery";
import AccountView from "./components/AccountView";
import * as AccountActions from "./actions/account";

import * as AuthActions from "./actions/auth";

import TestView from "./components/Test/Test";
import * as TestActions from "./actions/test";

import ContentView from "./components/ContentPage";
import NotFoundPage from "./components/NotFoundPage";
import ErrorPage from "./components/ErrorPage";

const TestContainer = container(TestView, TestActions, "test");
const HomeContainer = container(HomeView, HomeActions, "home");
const LoginContainer = container(LoginView, AuthActions, "login");
const LoginRecoveryContainer = container(LoginRecoveryView, LoginRecoveryActions, "recovery");
const AccountContainer = container(AccountView, AccountActions, "account");
const ContentContainer = container(ContentView, {}, "content");

export default new Router(on => {
  
  on("*", async (state, next) => {
    
    const component = await next();
    let intlData = state.context.intlData;
    console.log("intl data", intlData);
    return component && <App context={state.context} {...intlData}>{component}</App>;
  
  });

  on("/test", () => <TestContainer />);
  on("/home", () => <HomeContainer />);
  on("/login/recovery", () => <LoginRecoveryContainer />);
  on("/login/:token?", () => <LoginContainer />);
  on("/account/:uuid?", (state) => <AccountContainer params={state.params} />);
  on("/denied", (state) => {
    return <ContentContainer path={state.path} />
  });

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
