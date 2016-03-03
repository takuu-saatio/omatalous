import request from "superagent";
import React, { Component, PropTypes } from "react";
import s from "./LoginView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import RaisedButton from "material-ui/lib/raised-button";
import reactMixin from "react-mixin";
import ReactIntl from "react-intl";
import BaseComponent from "../BaseComponent";
import * as utils from "../../utils";

const title = "Log In";

@withStyles(s)
@reactMixin.decorate(ReactIntl.IntlMixin)
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
  
  _togglePassword() {
    const pwdContainer = document.getElementById("password");
    const pwdField = pwdContainer.getElementsByTagName("input")[0];
    const imageElem = pwdContainer.getElementsByTagName("i")[0];
    if (pwdField.type === "password") {
      pwdField.type = "text";
      imageElem.innerHTML = "&#xE8F4;";
    } else {
      pwdField.type = "password";
      imageElem.innerHTML = "&#xE8F5;";
    }
  }
  
  render() {
    
    const { register, logIn, test } = this.props;
     
    let errorElem = this.state.error ? this.createErrorElem(this.state.error) : null;
    console.log("login page", this.state, this.props);
    
    let loginForm = this.state.token ? 
      this._renderTokenLoginForm() : this._renderLoginForm();

    return (
      <div>
        <div className={s.root}>
          {errorElem}
          <div className={s.container}>
            {loginForm}
          </div>
        </div>
      </div>
    );
  }
  
  _renderTokenLoginForm() {

    return (
      <div>
        <div className={s.description}>
          Voit kirjautua tältä sivulta vain yhden kerran. Muista asettaa salasanasi tiliasetuksistasi, kirjauduttuasi sisään.
        </div>
        <form className={s.renewForm} action="/login" method="post">
          <input type="hidden" name="email" value="token" />
          <input type="hidden" name="password" value={this.state.token} />
          <RaisedButton secondary={true} type="submit" label="SISÄÄN" />
        </form>
      </div>
    );

  }

  _renderLoginForm() {

    let loginParams = this.state.loginParams;
    const textFieldCss = {
      width: "100%"
    };

    const showPwdCss = {
      position: "absolute",
      right: "0px",
      top: "40px",
      cursor: "pointer"
    };
    
    const emailStatus = utils.emailValid(loginParams.email);
    const passwordStatus = utils.passwordValid(loginParams.password);
    const disableLogin = !(emailStatus.pass && passwordStatus.pass);

    return (
      <div>
          <div>
            <div className={s.description}>
              Kirjaudu sisään jollain alla olevista tavoista.
              Jos et ole käyttänyt palvelua aiemmin, tunnuksesi luodaan
              ensimmäisen kirjautumisen yhteydessä.
              <br/><br/>
              Kirjautumalla sovellukseen hyväksyt sovelluksen&nbsp;
              <a href="#">ehdot</a>.
            </div>
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
            <form action="/login" method="post" className={s.pwdLogin}>
              <div className={s.formTitle}>
                Kirjaudu sähköpostilla ja salasanalla
              </div>
              <div className={s.formItem}>
                <div className={s.formInput}>
                  <TextField
                    style={textFieldCss}
                    name="email"
                    floatingLabelText={emailStatus.text}
                    floatingLabelStyle={emailStatus.style}
                    value={loginParams.email} 
                    onChange={this.handleInputChange.bind(this)} />
                </div>
              </div>
              <div className={s.formItem}>
                <div className={s.formInput} id="password">
                  <TextField
                    style={textFieldCss}
                    type="password"
                    name="password"
                    floatingLabelText={passwordStatus.text}
                    floatingLabelStyle={passwordStatus.style}
                    value={loginParams.password}
                    onChange={this.handleInputChange.bind(this)} /> 
                  <div onClick={() => this._togglePassword()} style={showPwdCss}>
                    <i className="material-icons">&#xE8F5;</i>
                  </div>
                </div>
              </div>
              <div className={s.formSubmit}>  
                <div className={s.recoveryLink}>
                  <a href="/login/recovery">
                    Salasana unohtunut!
                  </a>
                </div>
                <div className={s.submitButton}>
                  <RaisedButton disabled={disableLogin}
                    secondary={true} type="submit" label="Sisään">
                  </RaisedButton>
                </div>
              </div>
              <div>
              </div>
            </form>
          </div>
      </div>
    );

  }



  createErrorElem(error) {
    return (
      <div className={s.error}> 
        {error.message || this.getIntlMessage(error.id)}
      </div>
    );
  }

}

export default LoginPage;
