import React, { Component, PropTypes } from "react";
import reactMixin from "react-mixin";
import ReactIntl from "react-intl";
import s from "./AccountView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";
import * as utils from "../../utils";

@withStyles(s)
@reactMixin.decorate(ReactIntl.IntlMixin)
class AccountView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    console.log("constr account", props);
    this.showPwd = false;
    this.state = Object.assign(props.state, {
    });
  }

  async fetchData(props = this.props) { 

    if (props.state.status === "deleted") {
      return;
    }

    if (this.showPwd) {
      this.showPwd = false;
      return;
    }

    const uuid = this.props.params.uuid || this.state.auth.user.uuid; 
    console.log("fetching data for", uuid);
    this.props.fetchAccount(uuid);

  }
  
  updateState(state) {
    super.updateState(state);
    if (state.status === "deleted") {
      if (this.props.params.uuid) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/home";
      }
    }
  }

  _handleFormChange(name, value) {
    
    let formParams = {};
    formParams[name] = value;
    let account = Object.assign(this.state.account, formParams);
    let state = Object.assign(this.state, { account });
    
    if (name === "password") {
      state.pwdSaved = false;
    } else {
      state.messages = { editStatus: "changed" };
    }

    if (name === "age") {
         
      delete state.ageError;
      
      if (value && value !== "") {
        if (isNaN(value)) {
          state.ageError = "Ei numero";        
        } else if (parseFloat(value) < 1900) {
          state.ageError = "Liian vanha";
        } else if (parseFloat(value) > 2006) {
          state.ageError = "Liian nuori";
        } else if (parseFloat(value) % 1 !== 0) {
          state.ageError = "Ei kokonaisluku";
        }
      }

    }

    return state;
  
  }
  
  _handleInputChange(event) {
    
    let state = this._handleFormChange(event.target.name, event.target.value);
    
    const { account } = this.state;
    if (event.target.name === "password") {
      state = { account: Object.assign(account, { password: account.password }) };
      this.setState(state);
    } else {
      delete state.account.password;
      state.messages = { editStatus: "changed" };
      this.setState(state);
    }
    
  }
  
  _handleGenderDropdown(event, index, value) {
    this.setState(this._handleFormChange("gender", value));
  }
  
  _handleAgeDropdown(event, index, value) {
    this.setState(this._handleFormChange("age", value));
  }

  _saveAccount() {
    const account = Object.assign({}, this.state.account);
    delete account.password;
    this.props.saveAccount(account)
  }
  
  _savePassword() {
    this.props.saveAccount({
      uuid: this.state.account.uuid, 
      password: this.state.account.password 
    });
  }

  _deleteAccount() {
    if (window.confirm("Olet poistamassa tiliäsi. Tätä toimenpidettä ei ehkä ole mahdollista peruuttaa. Oletko varma, että haluat jatkaa?")) {
      this.props.deleteAccount(this.state.account.uuid);
    }
  }

  _togglePassword() {
    this.showPwd = true;
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
     
    console.log("render account", this.props, this.state);
    let { account, messages, pwdSaved } = this.state;
    
    if (!account) {
      return null;
    }
    
    let formError = null;
    if (this.state.error) {
      formError = (
        <span>Error: {this.state.error.id}</span>
      );
    }
    
    let editStatus = null;
    if (messages && messages.editStatus && !pwdSaved) {
      
      let statusColor = {};
      switch (messages.editStatus) {
        case "changed":
          statusColor = { color: "blue" };
          break;
        case "saved":
          statusColor = { color: "green" };
          break;
        case "save_failed":
          statusColor = { color: "red" };
          break;
        default:
          statusColor = {};
      }

      editStatus = (
        <span style={statusColor}>{this.getIntlMessage(messages.editStatus)}</span>
      );
    }

    let pwdStatus = null;
    if (pwdSaved) {
      pwdStatus = (
        <span style={{ color: "green" }}>Vaihdettu</span>
      );
    }
    
    let fullWidth = { width: "100%" };
    let deleteButtonCss = { 
      width: "100%",
      backgroundColor: "#DC4E41" 
    };

    const showPwdCss = {
      position: "absolute",
      right: "0px",
      top: "40px",
      cursor: "pointer"
    };
    
    const emailStatus = utils.emailValid(account.email); 
    if (!account.email || account.email === "") {
      emailStatus.text = "Pakollinen tieto";
      emailStatus.style = { color: "red" };
      delete emailStatus.pass;
    }

    const saveDisabled = !(!this.state.ageError && emailStatus.pass);

    const passwordStatus = utils.passwordValid(account.password); 
    if (passwordStatus.text === "Salasana") {
      passwordStatus.text = "Uusi salasana";
    }
    if (!account.password || account.password === "") {
      delete passwordStatus.pass;
    }
    
    
    let accountIcon = <i className="material-icons">&#xE853;</i>;
    let accountName = null;
    if (account && account.icon) {
      
      accountIcon = <img src={account.icon}/>;
      accountName = account.email;
      
      if (account.firstName) {
        accountName = " "+account.firstName;
      }
      
      if (account.lastName) {
        accountName += " "+account.lastName; 
      }

      accountName = accountName.trim();

    }

    return (
      <div>
        {formError}
        <div className={s.root}>
          <div className={s.profile}>
            <div className={s.profileTitle}>
              Profiili 
            </div>
            <div className={s.profileImage}>
              <div className={s.imageCell}>
                {accountIcon}
              </div>
              <div className={s.nameCell}>
                {accountName}
              </div> 
            </div>
            <div className={s.profileRow}>
              <div className={s.profileCell}>
                <TextField style={fullWidth}
                  name="email" 
                  floatingLabelText={emailStatus.text}
                  floatingLabelStyle={emailStatus.style}
                  value={account.email}
                  onChange={this._handleInputChange.bind(this)} />
              </div>
              <div className={s.profileCell}>
                <TextField style={fullWidth} 
                  name="username" 
                  floatingLabelText="Käyttäjätunnus"
                  value={account.username}
                  onChange={this._handleInputChange.bind(this)} />
              </div>
            </div>
            <div className={s.profileRow}>
              <div className={s.profileCell}>
                <TextField style={fullWidth}
                  name="firstName" 
                  floatingLabelText="Etunimi"
                  value={account.firstName}
                  onChange={this._handleInputChange.bind(this)} />
              </div>
              <div className={s.profileCell}>
                <TextField style={fullWidth} 
                  name="lastName" 
                  floatingLabelText="Sukunimi"
                  value={account.lastName}
                  onChange={this._handleInputChange.bind(this)} />
              </div>
            </div>
            <div className={s.profileRow}>
              <div className={s.profileCell}>
                <div className={s.dropdownLabel}>Sukupuoli</div>
                <DropDownMenu style={Object.assign({ width: "100%", height: "43px" })}
                  name="gender"
                  value={account.gender} 
                  onChange={this._handleGenderDropdown.bind(this)}>
                  <MenuItem value="M" primaryText="Mies" />
                  <MenuItem value="F" primaryText="Nainen" />
                </DropDownMenu>
              </div>
              <div className={s.profileCell}>
                <TextField style={Object.assign({ marginTop: "-5px" }, fullWidth)} 
                  name="age" 
                  floatingLabelText="Syntymävuosi"
                  errorText={this.state.ageError}
                  value={account.age}
                  onChange={this._handleInputChange.bind(this)} />
              </div>
            </div>
            <div className={s.saveProfile}>
              <div className={s.editStatus}>
                {editStatus}
              </div>
              <div className={s.saveButton}>
                <FlatButton disabled={saveDisabled}
                  onTouchTap={() => this._saveAccount()} label="Tallenna" />
              </div>
            </div>
          </div>
          <div className={s.password}>
            <div className={s.passwordTitle}>
              Salasanan vaihto 
            </div>
            <div className={s.passwordInput} id="password">
              <TextField style={fullWidth} 
                type="password"
                name="password" 
                floatingLabelText={passwordStatus.text}
                floatingLabelStyle={passwordStatus.style}
                value={account.password}
                onChange={this._handleInputChange.bind(this)} />
              <div onClick={() => this._togglePassword()} style={showPwdCss}>
                <i className="material-icons">&#xE8F5;</i>
              </div>
            </div>
            <div className={s.changePassword}>
              <div className={s.pwdStatus}>
                {pwdStatus}
              </div>
              <div className={s.changePwdButton}>
                <FlatButton disabled={!passwordStatus.pass}
                  onTouchTap={() => this._savePassword()} label="Vaihda" />
              </div>
            </div>
          </div>
          <div className={s.deleteAccount}>
            <FlatButton style={deleteButtonCss} onClick={() => this._deleteAccount()} label="POISTA TILI" />
          </div>
        </div>
      </div>
    );
  }

}

export default AccountView;
