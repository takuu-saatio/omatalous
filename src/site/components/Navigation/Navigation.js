"use strict";

import React, { Component, PropTypes } from "react";
import reactMixin from "react-mixin";
import ReactIntl from "react-intl";
import cx from "classnames";
import s from "./Navigation.scss";
import withStyles from "../../decorators/withStyles";
import FlatButton from "material-ui/lib/flat-button";
import FontIcon from "material-ui/lib/font-icon";
import IconButton from "material-ui/lib/icon-button";
import Link from "../Link";
import Location from "../../../core/Location";

@withStyles(s)
@reactMixin.decorate(ReactIntl.IntlMixin)
class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
  };
  
  _isSelectedCss(path) {
    
    let style = {
      borderBottom: "4px solid rgba(0, 0, 0, 0)"
    };

    let propPath = this.props.path;
    if (!propPath) {
      return style;
    }

    let hashIndex = propPath.indexOf("#");
    if (hashIndex !== -1) {
      propPath = propPath.substring(0, hashIndex);
    }

    if (propPath === path) {
      style = { 
        borderBottom: "4px solid #00bcd4"
      };
    }

    return style;

  }

  render() {

    const { auth } = this.props;
    
    let adminElem = null;
    let accountElem = null;
    let loginElem = null;
    let consumptionElem = null;
    let goalsElem = null;
    let planningElem = null;

    if (auth && auth.user) {
        
      const iconItemStyle = {
        fontSize: "36px",
        color: "#e0e0e0"
      };
      const iconStyle = {
        paddingLeft: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingTop: "2px",
        width: "initial",
        height: "initial"
      };
      const tooltipStyles = {
        marginTop: "-15px",
        marginLeft: "-6px"
      };
 
      if (auth.user.isAdmin) {
        adminElem = (
          <div className={cx(s.navItem, s.minHidden)}
            onTouchTap={() => Location.go("/admin")}
            style={this._isSelectedCss("/admin")}>
            <div className={s.navLabel}>Hallinta</div>
          </div>
        );
      }
      
      let accountIcon = auth.user.icon ?
        <img src={auth.user.icon}/> :
        <i className="material-icons">&#xE853;</i>
        
      accountElem = (
        <div className={cx(s.navItem, s.iconItem, s.minHidden)}>
          <a className={s.link} href="/account" onClick={Link.handleClick}>
            {accountIcon}
          </a>
        </div>
      );
       
      consumptionElem = (
        <div className={cx(s.navItem, s.minHidden)}
          onTouchTap={() => Location.go("/consumption")}
          style={this._isSelectedCss("/consumption")}>
          <div className={s.navLabel}>Tilanne</div>
        </div>
      );
      
      goalsElem = (
        <div className={cx(s.navItem, s.minHidden)}
          onTouchTap={() => Location.go("/goals")}
          style={this._isSelectedCss("/goals")}>
          <div className={s.navLabel}>Talouteni</div>
        </div>
      );
      
      planningElem = (
        <div className={cx(s.navItem, s.minHidden)}
          onTouchTap={() => Location.go("/planning")}
          style={this._isSelectedCss("/planning")}>
          <div className={s.navLabel}>Muistikirja</div>
        </div>
      );

      loginElem = (
        <div className={cx(s.buttonItem, s.logoutItem)}>
          <a className={s.link} style={{ verticalAlign: "top" }} href="/logout">
            <FlatButton style={{ minWidth: "initial" }} labelStyle={{ color: "#e0e0e0" }} 
              label={this.getIntlMessage("logout")} />
          </a>
        </div>
      );
      

    } else {
      
      loginElem = this.props.path !== "/login" ? (
        <div className={cx(s.buttonItem)}>
          <a className={s.link} href="/login" onClick={Link.handleClick}>
            <FlatButton labelStyle={{ color: "#e0e0e0" }} 
              label={this.getIntlMessage("login")} />
          </a>
        </div>
      ) : null;

    }

    return (
      <div className={cx(s.root, this.props.className)} role="navigation">
        <div className={s.leftNav}>
          {consumptionElem}
          {goalsElem}
          {planningElem}
          {adminElem}
        </div>
        <div className={s.rightNav}>
          {accountElem}
          {loginElem}
        </div>
      </div>
    );
  }

}

export default Navigation;
