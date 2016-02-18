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
          <div className={cx(s.navItem, s.iconItem, s.minHidden)}>
            <IconButton onClick={() => Location.go("/admin")}
              iconClassName="material-icons"
              tooltip="Hallinta"
              iconStyle={iconItemStyle}
              tooltipStyles={tooltipStyles}
              style={iconStyle}>
              &#xE8D3;
            </IconButton>
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
        <div className={cx(s.navItem, s.iconItem, s.minHidden)}>
          <IconButton onClick={() => Location.go("/consumption")}
            iconClassName="material-icons"
            tooltip="Kulutus"
            iconStyle={iconItemStyle}
            tooltipStyles={tooltipStyles}
            style={iconStyle}>
            &#xE870;
          </IconButton>
        </div>
      );
      
      goalsElem = (
        <div className={cx(s.navItem, s.iconItem, s.minHidden)}>
          <IconButton onClick={() => Location.go("/goals")}
            iconClassName="material-icons"
            tooltip="Tavoitteet"
            iconStyle={iconItemStyle}
            tooltipStyles={tooltipStyles}
            style={iconStyle}>
            &#xE850;
          </IconButton>
        </div>
      );
      
      planningElem = (
        <div className={cx(s.navItem, s.iconItem, s.minHidden)}>
          <IconButton onClick={() => Location.go("/planning")}
            iconClassName="material-icons"
            tooltip="Suunnittelu"
            iconStyle={iconItemStyle}
            tooltipStyles={tooltipStyles}
            style={iconStyle}>
            &#xE878;
          </IconButton>
        </div>
      );

      loginElem = (
        <div className={cx(s.navItem, s.buttonItem, s.logoutItem)}>
          <a className={s.link} style={{ verticalAlign: "top" }} href="/logout">
            <FlatButton labelStyle={{ color: "#e0e0e0" }} 
              label={this.getIntlMessage("logout")} />
          </a>
        </div>
      );
      

    } else {
      
      loginElem = this.props.path !== "/login" ? (
        <div className={cx(s.navItem, s.buttonItem)}>
          <a className={s.link} href="/login" onClick={Link.handleClick}>
            <FlatButton labelStyle={{ color: "#e0e0e0" }} 
              label={this.getIntlMessage("login")} />
          </a>
        </div>
      ) : null;

    }

    return (
      <div className={cx(s.root, this.props.className)} role="navigation">
        {accountElem}
        {consumptionElem}
        {goalsElem}
        {planningElem}
        {adminElem}
        {loginElem}
      </div>
    );
  }

}

export default Navigation;
