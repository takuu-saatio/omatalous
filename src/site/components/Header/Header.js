"use strict";

import React, { Component } from "react";
import reactMixin from "react-mixin";
import ReactIntl from "react-intl";
import withStyles from "../../decorators/withStyles";
import s from "./Header.scss";
import AppBar from "material-ui/lib/app-bar";
import IconButton from "material-ui/lib/icon-button";
import NavigationClose from "material-ui/lib/svg-icons/navigation/close";
import FlatButton from "material-ui/lib/flat-button";
import Link from "../Link";
import Navigation from "../Navigation";

import BaseComponent from "../BaseComponent";

@withStyles(s)
class Header extends Component {

  _handleTouchTap() {
    console.log("tip-tap");
  }

  render() {
    
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.navMin}>
            <i className="material-icons">&#xE5D2;</i>
          </div>
          <div className={s.logo}>
            <a className={s.brand} href="/" onClick={Link.handleClick}>
              <img src={require("./logo-small.png")} width="38" height="38" alt="React" />
              <span className={s.brandTxt}>Omatalous</span>
            </a>
          </div>
          <Navigation auth={this.props.auth} selection={this.props.selection} className={s.navFull} />
        </div>
      </div>
    );
  }

}

export default Header;
