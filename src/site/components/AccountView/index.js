import React, { Component, PropTypes } from "react";
import BaseComponent from "../BaseComponent";
import Header from "../Header";
import Feedback from "../Feedback";
import Footer from "../Footer";

class AccountView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    console.log("constr account", props);
    this.state = Object.assign(props.state, {
    });
  }

  _handleInputChange(event) {

    let formParams = {};
    formParams[event.target.name] = event.target.value;
    let account = Object.assign(this.state.account, formParams);
    this.setState(Object.assign(this.state, { account }));
  
  }
  
  _saveAccount() {
    this.props.saveAccount(this.state.account)
  }
  
  _deleteAccount() {
    this.props.deleteAccount(this.state.account.id)
  }

  render() {
     
    console.log("render account", this.props, this.state);
    let { account } = this.state;

    return (
      <div>
        <Header />
        <div>
          <div>
            Sähköposti
            <input type="text" 
              name="email" 
              value={account.email}
              onChange={this._handleInputChange.bind(this)} />
          </div>
          <div>
            Salasana
            <input type="text" 
              name="password" 
              value={account.password}
              onChange={this._handleInputChange.bind(this)} />
          </div>
          <div>
            Tunnus
            <input type="text" 
              name="username" 
              value={account.username}
              onChange={this._handleInputChange.bind(this)} />
          </div>
          <div>
            Etunimi
            <input type="text" 
              name="firstName" 
              value={account.firstName}
              onChange={this._handleInputChange.bind(this)} />
          </div>
          <div>
            Sukunimi
            <input type="text" 
              name="lastName" 
              value={account.lastName}
              onChange={this._handleInputChange.bind(this)} />
          </div>
          <div>
            <button onClick={() => this._saveAccount()}>Tallenna</button>
            <button onClick={() => this._deleteAccount()}>Poista</button>
          </div>
        </div>
        <Feedback />
        <Footer />
      </div>
    );
  }

}

export default AccountView;
