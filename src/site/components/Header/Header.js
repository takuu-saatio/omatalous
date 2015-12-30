"use strict";

import React, { Component } from "react";
import reactMixin from "react-mixin";
import ReactIntl from "react-intl";
import cx from "classnames";
import withStyles from "../../decorators/withStyles";
import s from "./Header.scss";
import AppBar from "material-ui/lib/app-bar";
import Menu from "material-ui/lib/menus/menu";
import MenuItem from "material-ui/lib/menus/menu-item";
import IconButton from "material-ui/lib/icon-button";
import NavigationClose from "material-ui/lib/svg-icons/navigation/close";
import FlatButton from "material-ui/lib/flat-button";
import Link from "../Link";
import Navigation from "../Navigation";

import BaseComponent from "../BaseComponent";

const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

@withStyles(s)
class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      navOpen: false
    };
  }

  _handleToggle = () => this.setState({ navOpen: !this.state.navOpen });
  _handleClose = () => this.setState({ navOpen: false });
  
  _gotoAccountView() {
    window.location.href = "/account";
  }
  
  _gotoAdminView() {
    window.location.href = "/admin";
  }

  _logOut() {
    window.location.href = "/logout";
  }

  render() {
    
    const { auth } = this.props;
     
    const fadeBgCss = {
      opacity: this.state.navOpen ? "0.5" : "0",
      left: this.state.navOpen ? "0px" : "-100%",
    };
 
    const leftNavCss = {
      left: this.state.navOpen ? "0px" : "-200px",
    };
    
    let leftNavIcon = null;
    let adminNavItem = null;
    let logoStyles = s.logo;
    
    if (auth && auth.user) {
      
      logoStyles = cx(s.logo, s.loggedIn);
         
      leftNavIcon = (
        <div className={s.navMin}>
          <i className="material-icons" onTouchTap={() => this._handleToggle()}>&#xE5D2;</i>
        </div>
      );
      
      if (auth.user.email === "vhalme@gmail.com") {
        adminNavItem = (
          <MenuItem onTouchTap={this._gotoAdminView}>
            <div className={s.menuItem}>
              <i className="material-icons">&#xE8D3;</i>
              <span>Hallinta</span>
            </div>
          </MenuItem> 
        );
      }
      
    }
     
    return (
      <div className={s.root}>
        <div className={s.container}>
          {leftNavIcon}
          <div className={logoStyles}>
            <a className={s.brand} href="/" onClick={Link.handleClick}>
              <img src={require("./logo-small.png")} width="38" height="38" alt="React" />
              <span className={s.brandTxt}>Omatalous</span>
            </a>
          </div>
          <Navigation auth={this.props.auth} selection={this.props.selection} className={s.navFull} />
        </div>
        <div className={s.fadeBg} style={fadeBgCss} onTouchTap={this._handleClose}></div>
        <div className={s.leftNav} style={leftNavCss}>
          <MenuItem onTouchTap={this._gotoAccountView}>
            <div className={s.menuItem}>
              <i className="material-icons">&#xE853;</i>
              <span>Tili</span>
            </div>
          </MenuItem>
          {adminNavItem}
          <MenuItem primaryText="Ulos" onTouchTap={this._logOut} />
        </div>
      </div>
    );
  }

}

export default Header;
