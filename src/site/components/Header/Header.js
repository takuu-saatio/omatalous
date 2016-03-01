"use strict";

import React, { Component } from "react";
import reactMixin from "react-mixin";
import ReactIntl from "react-intl";
import cx from "classnames";
import withStyles from "../../decorators/withStyles";
import s from "./Header.scss";
import Menu from "material-ui/lib/menus/menu";
import MenuItem from "material-ui/lib/menus/menu-item";
import IconButton from "material-ui/lib/icon-button";
import NavigationClose from "material-ui/lib/svg-icons/navigation/close";
import FlatButton from "material-ui/lib/flat-button";
import Link from "../Link";
import Location from "../../../core/Location";
import Navigation from "../Navigation";

import BaseComponent from "../BaseComponent";

const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

@withStyles(s)
class Header extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = Object.assign(props.state || {}, {
      navOpen: false
    });
  }

  _toggleLeftNav() {
    this.setState({ navOpen: !this.state.navOpen });
  }
  
  _closeLeftNav() {
    this.setState({ navOpen: false });
  }
  
  _logOut() {
    window.location.href = "/logout";
  }
  
  _menuGo(path) {
    this.state.navOpen = false;
    Location.go(path);
  }

  _getItemCss(path) {

    let appPath = this.state.routing.path || this.props.path;
    
    let hashIndex = appPath.indexOf("#");
    if (hashIndex !== -1) {
      appPath = appPath.substring(0, hashIndex);
    }

    return Object.assign({ 
      borderTop: "1px solid #f0f0f0" 
    }, appPath === path ? {
      borderLeft: "5px solid #00bcd4"
    } : {});
  }

  render() {
    
    console.log("HEADER", this.state, this.props); 
    const { auth } = this.state;
     
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
    let logoNavPath = "/";
        
    const menuItemStyle = {
      borderTop: "1px solid #f0f0f0"
    };

    if (auth && auth.user) {
      
      logoNavPath = "/consumption";  
      logoStyles = cx(s.logo, s.loggedIn);
         
      leftNavIcon = (
        <div className={s.navMin}>
          <i className="material-icons" onTouchTap={() => this._toggleLeftNav()}>&#xE5D2;</i>
        </div>
      );
      
      if (auth.user.isAdmin) {
        adminNavItem = (
          <MenuItem style={this._getItemCss("/admin")} onTouchTap={() => this._menuGo("/admin")}>
            <div className={s.menuItem}>
              <span>Hallinta</span>
            </div>
          </MenuItem> 
        );
      }
      
    }
     
    let accountIcon = <i className="material-icons">&#xE853;</i>;
    let accountName = null;
    if (auth.user && auth.user.icon) {
      
      accountIcon = <img src={auth.user.icon}/>;
      accountName = auth.user.email;
      
      if (auth.user.firstName) {
        accountName = " "+auth.user.firstName;
      }
      
      if (auth.user.lastName) {
        accountName += " "+auth.user.lastName; 
      }

      accountName = accountName.trim();

    }
    
    return (
      <div className={s.root}>
        <div className={s.container}>
          {leftNavIcon}
          <div className={logoStyles}>
            <a className={s.brand} href={logoNavPath} onClick={Link.handleClick}>
              <i className="material-icons">&#xE251;</i>
              <span className={s.brandTxt}>Omatalous</span>
            </a>
          </div>
          <Navigation auth={auth} 
            path={this.state.routing.path || this.props.path} 
            className={s.navFull} />
        </div>
        <div className={s.fadeBg} style={fadeBgCss} onTouchTap={() => this._closeLeftNav()}></div>
        <div className={s.leftNav} style={leftNavCss}>
          <MenuItem onTouchTap={() => this._menuGo("/account")}>
            <div className={s.menuItem}>
              <div className={s.userImage}>{accountIcon}</div>
              <div className={s.userName}>{accountName}</div>
            </div>
          </MenuItem>
          <MenuItem style={this._getItemCss("/consumption")} 
            onTouchTap={() => this._menuGo("/consumption")}>
            <div className={s.menuItem}>
              <span>Tilanne</span>
            </div>
          </MenuItem>
          <MenuItem style={this._getItemCss("/goals")} 
            onTouchTap={() => this._menuGo("/goals")}>
            <div className={s.menuItem}>
              <span>Suunnittelu</span>
            </div>
          </MenuItem>
          <MenuItem style={this._getItemCss("/planning")} 
            onTouchTap={() => this._menuGo("/planning")}>
            <div className={s.menuItem}>
              <span>Suunnittelu</span>
            </div>
          </MenuItem>
          <MenuItem style={this._getItemCss("/account")} 
            onTouchTap={() => this._menuGo("/account")}>
            <div className={s.menuItem}>
              <span>Profiili</span>
            </div>
            <div className={s.itemSelection}></div>
          </MenuItem>
          {adminNavItem}
          <MenuItem style={menuItemStyle} 
            onTouchTap={this._logOut}>
            <div className={s.menuItem}>
              <span>Kirjaudu ulos</span>
              <i className="material-icons">&#xE8AC;</i>
            </div>
          </MenuItem>
        </div>
      </div>
    );
  }

}

export default Header;
