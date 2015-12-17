import request from "superagent";
import React, { Component, PropTypes } from "react";
import s from "./LoginPage.scss";
import withStyles from "../../decorators/withStyles";
import BaseComponent from "../BaseComponent/BaseComponent";
import http from "../../tools/http-client";

const title = "Log In";

@withStyles(s)
class LoginPage extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = Object.assign({
      loginParams: {
        email: "",
        password: ""
      }
    }, props.state);
  }
  
  async fetchData() {
  }

  createErrorElem(error) {
    return (
      <div>{error.message}</div>
    );
  }
  
  handleInputChange(event) {

    let formParams = {};
    formParams[event.target.name] = event.target.value;
    let loginParams = Object.assign(this.state.loginParams, formParams);
    this.setState(Object.assign(this.state, { loginParams }));
  
  }

  _logIn() {
    
    let loginParams = Object.assign({
      method: "password"
    }, this.state.loginParams);

    this.props.logIn(loginParams);
  
  }
  
  render() {
    
    const { register, logIn, test } = this.props;
     
    let errorElem = this.state.error ? this.createErrorElem(this.state.error) : null;
    console.log("login page", this.state);
    
    let loginParams = this.state.loginParams;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <p>...</p>
          {errorElem}
          E-mail <input type="text" name="email" value={loginParams.email} onChange={this.handleInputChange.bind(this)} /> 
          Password <input type="text" name="password" value={loginParams.password} onChange={this.handleInputChange.bind(this)} /> 
          <button onClick={() => logIn({ method: "passport", email: "a", password: "b" })}>Login</button>
          <button onClick={() => register({ wmail: "test1@test.com", password: "pwd1" })}>Register</button>
          <button onClick={() => test()}>Test</button>
        </div>
      </div>
    );
  }

}

export default LoginPage;
