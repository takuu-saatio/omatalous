import request from "superagent";
import React, { Component, PropTypes } from "react";
import s from "./LoginView.scss";
import withStyles from "../../decorators/withStyles";
import BaseComponent from "../BaseComponent";
import Header from "../Header";
import Feedback from "../Feedback";
import Footer from "../Footer";

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
        username: "",
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

  _register() {
    
    let regParams = Object.assign({
      method: "password"
    }, this.state.loginParams);

    this.props.register(regParams);

  }
  
  render() {
    
    const { register, logIn, test } = this.props;
     
    let errorElem = this.state.error ? this.createErrorElem(this.state.error) : null;
    console.log("login page", this.state, s);
    
    let loginForm = this._renderLoginForm();

    return (
      <div>
        <Header auth={this.state.auth} />
        <div className={s.root}>
          {errorElem}
          <div className={s.container}>
            <p>Kirjaudu sisään jollain alla olevista tavoista. Jos et ole käyttänyt palvelua aiemmin, tunnuksesi luodaan ensimmäisen kirjautumisen yhteydessä.</p>
            {loginForm}
          </div>
        </div>
        <button onClick={() => test()}>Test</button>
        <Feedback />
        <Footer />
      </div>
    );
  }
  
  
  _renderLoginForm() {

    let loginParams = this.state.loginParams;
  
    return (
      <div>
          <div>
            <div className={s.extLogin}>
              <div className={s.fbLogin}>
                <a href="/login/fb">
                  <div className={s.fbButton}>
                    <img src={require("./FB-f-Logo__blue_50.png")} />
                  </div>
                  <div className={s.fbText}>
                    <span>Kirjaudu Facebook-tunnuksilla</span>
                  </div>
                </a>  
              </div>
              <div className={s.gLogin}>
                <a href="/login/google">
                  <div className={s.gButton}>
                    <img src={require("./btn_google.png")} />
                  </div>
                  <div className={s.gText}>
                    Kirjaudu Google-tunnuksilla
                  </div>
                </a>  
              </div>
            </div>
            <div className={s.pwdLogin}>
              <div className={s.formTitle}>
                Kirjaudu sähköpostilla ja salasanalla
              </div>
              <div className={s.formItem}>
                <div className={s.formLabel}>Sähköposti</div>
                <div className={s.formInput}>
                  <input type="text" 
                    name="email" 
                    value={loginParams.email} 
                    onChange={this.handleInputChange.bind(this)} />
                </div>
              </div>
              <div className={s.formItem}>
                <div className={s.formLabel}>Salasana</div>
                <div className={s.formInput}>
                  <input type="text"
                    name="password"
                    value={loginParams.password}
                    onChange={this.handleInputChange.bind(this)} /> 
                </div>
              </div>
              <div className={s.formSubmit}>  
                <button onClick={() => this._logIn()}>Sisään</button>
              </div>
            </div>
          </div>
      </div>
    );

  }



  createErrorElem(error) {
    return (
      <div className={s.error}>{error.message}</div>
    );
  }

}

export default LoginPage;
