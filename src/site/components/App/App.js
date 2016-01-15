"use strict";

import React, { Component, PropTypes } from "react";
import { Router, Route } from "react-router";
import { syncReduxAndRouter } from "redux-simple-router";
import reactMixin from "react-mixin";
import ReactIntl from "react-intl";
import emptyFunction from "fbjs/lib/emptyFunction";
import s from "./App.scss";
import Header from "../Header";
import Feedback from "../Feedback";
import Footer from "../Footer";

import { render } from "react-dom"
import { Provider } from "react-redux"
import configureStore from "../../configureStore"
import container from "../../container";
import Location from "../../../core/Location";
import { canUseDOM } from "fbjs/lib/ExecutionEnvironment";

import {
  HomeContainer,
  TestContainer,
  LoginContainer,
  LoginRecoveryContainer,
  AccountContainer,
  AdminContainer,
  ContentContainer,
  MainTabsContainer,
  GoalsContainer
} from "../../containers";

@reactMixin.decorate(ReactIntl.IntlMixin)
class Content extends Component {
   
  render() {  
  
    console.log("RERENDER CONTENT", canUseDOM, this.props); 
    const HeaderContainer = container(Header, {});

    let router = (
      <Router history={Location}>
        <Route path="/" component={HomeContainer} />
        <Route path="/home" component={HomeContainer} />
        <Route path="/login" component={LoginContainer} />
        <Route path="/login/recovery" component={LoginRecoveryContainer} />
        <Route path="/login/:token" component={LoginContainer} />
        <Route path="/admin" component={AdminContainer} />
        <Route path="/account" component={AccountContainer} />
        <Route path="/account/:uuid" component={AccountContainer} />
        <Route path="/consumption" component={MainTabsContainer} />
        <Route path="/consumption/:user" component={MainTabsContainer} />
        <Route path="/goals" component={GoalsContainer} />
        <Route path="/goals/:user" component={GoalsContainer} />
        <Route path="*" component={ContentContainer} />
      </Router>
    );

    if (!canUseDOM) {
      router = this.props.children;
    }

    return (
      <div>
        <HeaderContainer />
        {router}
        <Feedback />
        <Footer />
      </div>
    );

  }

}

class App extends Component {

  constructor(props) {
    super(props);
    let initialState = props.context.initialState || window.__INITIAL_STATE__; 
    this.intlData = props.context.intlData || window.__INTL_DATA__;
    this.store = configureStore(initialState);
    if (canUseDOM) {
      syncReduxAndRouter(Location, this.store);
    }
  }
  
  static propTypes = {
    context: PropTypes.shape({
      insertCss: PropTypes.func,
      onSetTitle: PropTypes.func,
      onSetMeta: PropTypes.func,
      onPageNotFound: PropTypes.func,
    }),
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
  };

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
      onSetTitle: context.onSetTitle || emptyFunction,
      onSetMeta: context.onSetMeta || emptyFunction,
      onPageNotFound: context.onPageNotFound || emptyFunction,
    };
  }

  componentWillMount() {
    this.removeCss = this.props.context.insertCss(s);
    console.log("App will mount");
  }

  componentWillUnmount() {
    this.removeCss();
  }

  componentWillReceiveProps(nextProps) {
    console.log("App will receive props");
  }

  render() {
    
    const state = this.store.getState();
    console.log("render state", state); 
    return !this.props.error ? ( 
      <div>
        <Provider store={this.store}>
          <Content {...this.intlData}>    
            {this.props.children}
          </Content>
        </Provider> 
      </div>
    ) : this.props.children;
  }

}

export default App;
