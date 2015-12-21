"use strict";

import React, { Component, PropTypes } from "react";
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

@reactMixin.decorate(ReactIntl.IntlMixin)
class Content extends Component {
  
  render() {  
    return (
      <div>
        {this.props.children}
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
