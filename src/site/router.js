import React from "react";
import Router from "react-routing/src/Router";
import http from "../core/HttpClient";

import App from "./components/App";

import NotFoundPage from "./components/NotFoundPage";
import ErrorPage from "./components/ErrorPage";

import {
  HomeContainer,
  TestContainer,
  LoginContainer,
  LoginRecoveryContainer,
  AccountContainer,
  AdminContainer,
  ContentContainer,
  MainTabsContainer,
  GoalsContainer,
  PlanningContainer 
} from "./containers";

export default new Router(on => {
  
  on("*", async (state, next) => {
    
    const component = await next();
    let intlData = state.context.intlData;
    console.log("intl data", intlData, state);
    return component && <App context={state.context} {...intlData}>{component}</App>;
  
  });

  on("/", () => <HomeContainer />);
  on("/test", () => <TestContainer />);
  on("/home", () => <HomeContainer />);
  on("/login/recovery", () => <LoginRecoveryContainer />);
  on("/login/:token?", () => <LoginContainer />);
  on("/account/:uuid?", (state) => <AccountContainer params={state.params} />);
  on("/consumption/:user?", (state) => <MainTabsContainer params={state.params} tab="consumption" />);
  on("/budgets/:user?", (state) => <MainTabsContainer params={state.params} tab="budget" />);
  on("/goals/:user?", (state) => <GoalsContainer params={state.params} />);
  on("/planning/:user?", (state) => <PlanningContainer params={state.params} />);
  on("/admin", () => <AdminContainer />);
  on("/denied", (state) => {
    return <ContentContainer path={state.path} />
  });

  on("*", (state) => {
    return <ContentContainer path={state.path} />
  });
  
  on("error", (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error}><NotFoundPage /></App> :
    <App context={state.context} error={error}><ErrorPage /></App>
  );

});
