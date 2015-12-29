"use strict";

import React, { Component, PropTypes } from "react";
import reactMixin from "react-mixin";
import ReactIntl from "react-intl";
import cx from "classnames";
import s from "./Navigation.scss";
import withStyles from "../../decorators/withStyles";
import FlatButton from "material-ui/lib/flat-button";
import Link from "../Link";

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

    if (auth && auth.user) {
        
      if (auth.user.email === "vhalme@gmail.com") {
        adminElem = (
          <div className={cx(s.navItem, s.iconItem, s.minHidden)}>
            <a className={s.link} href="/admin" onClick={Link.handleClick}>
              <i className="material-icons">&#xE8D3;</i>  
            </a>
          </div>
        );
      }
      
      accountElem = (
        <div className={cx(s.navItem, s.iconItem, s.minHidden)}>
          <a className={s.link} href="/account" onClick={Link.handleClick}>
            <i className="material-icons">&#xE87C;</i>
          </a>
        </div>
      );

      loginElem = (
        <div className={cx(s.navItem, s.buttonItem)}>
          <a className={s.link} style={{ verticalAlign: "top" }} href="/logout">
            <FlatButton label={this.getIntlMessage("logout")} labelStyle={{ color: "white" }} />
          </a>
        </div>
      );

    } else {
      
      loginElem = this.props.selection !== "login" ? (
        <div className={cx(s.navItem, s.buttonItem)}>
          <a className={s.link} href="/login" onClick={Link.handleClick}>
            <FlatButton label={this.getIntlMessage("login")} labelStyle={{ color: "white" }} />
          </a>
        </div>
      ) : null;

    }

    return (
      <div className={cx(s.root, this.props.className)} role="navigation">
        {adminElem}
        {accountElem}
        {loginElem}
      </div>
    );
  }

}

export default Navigation;
