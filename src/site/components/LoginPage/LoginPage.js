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
    this.state = props.state;
  }

  async fetchData() {
  }

  createErrorElem(error) {
    return (
      <div>{error.message}</div>
    );
  }

  render() {
    
    const { register, logIn, test } = this.props;
     
    let errorElem = this.state.error ? this.createErrorElem(this.state.error) : null;
    console.log("login page", this.state);

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <p>...</p>
          {errorElem}
          <button onClick={() => logIn({ email: "test1@test.com", password: "pwd1" })}>Login</button>
          <button onClick={() => register({ wmail: "test1@test.com", password: "pwd1" })}>Register</button>
          <button onClick={() => test()}>Test</button>
        </div>
      </div>
    );
  }

}

export default LoginPage;
