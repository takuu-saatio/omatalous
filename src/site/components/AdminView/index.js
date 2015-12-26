"use strict";

import React, { Component, PropTypes } from "react";
import Link from "../Link";
import BaseComponent from "../BaseComponent";
import Header from "../Header";
import Feedback from "../Feedback";
import Footer from "../Footer";

class AdminView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    console.log("constr admin", props);
    this.state = Object.assign(props.state, {
    });
  }

  async fetchData(props = this.props) { 
    console.log("fetching accounts");
    this.props.fetchAccounts();
  }
  
  render() {
     
    console.log("render admin", this.props, this.state);
    let { accounts, error } = this.state;
    
    if (!accounts) {
      return null;
    }
    
    let errorElem = null;
    if (error) {
      errorElem = (
        <span>Error: {error.id}</span>
      );
    }
    
    const accountElems = accounts.map(account => {

      const accountUrl = `/account/${account.uuid}`;
      return (
        <div key={account.uuid}>
          <a href={accountUrl} onClick={Link.handleClick}>{account.uuid}</a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {account.email}
        </div>
      );
    
    });

    return (
      <div>
        <Header auth={this.state.auth} />
        {errorElem}
        <div>
          {accountElems}
        </div>
        <Feedback />
        <Footer />
      </div>
    );
  }

}

export default AdminView;
