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
    
    const response = await http.get("/api/login");
    if (!response.error) {
      this.setState(response.login);
    }

  }

  render() {
    
    const { login, register, loginOrRegister } = this.props;
    
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <p>...</p>
          <p>Status: {this.state.status}</p>
          <button onClick={() => loginOrRegister()}>Login</button>
          <button onClick={() => this.fetchData()}>Register</button>
        </div>
      </div>
    );
  }

}

export default LoginPage;
