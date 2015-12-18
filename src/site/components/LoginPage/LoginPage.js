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
    
    let loginForm = this._renderLoginForm();

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <p>...</p>
          {errorElem}
          {loginForm}
          <button onClick={() => test()}>Test</button>
        </div>
      </div>
    );
  }
  
  
  _renderLoginForm() {

    let loginParams = this.state.loginParams;
  
    return (
      <div>
          <div>
            <button onClick={() => this._logIn("facebook")}>Facebook</button>
            <button onClick={() => this._logIn("google")}>Google</button>
          </div>
          <div>
            E-mail 
            <input type="text" name="email" value={loginParams.email} onChange={this.handleInputChange.bind(this)} /> 
          </div>
          <div>
            Password
            <input type="text" name="password" value={loginParams.password} onChange={this.handleInputChange.bind(this)} /> 
          </div>
          <div>
            <button onClick={() => this._logIn()}>Login</button>
          </div>
      </div>
    );

  }



  createErrorElem(error) {
    return (
      <div>{error.message}</div>
    );
  }

}

export default LoginPage;
