"use strict";

import React, { Component, PropTypes } from "react";
import reactMixin from "react-mixin";
import ReactIntl from "react-intl";
import cx from "classnames";
import s from "./Navigation.scss";
import withStyles from "../../decorators/withStyles";
import Link from "../Link";

@withStyles(s)
@reactMixin.decorate(ReactIntl.IntlMixin)
class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
  };

  render() {

    console.log("van props", this.props);

    const { auth } = this.props;
    
    let adminElem = null;
    let loginElem = null;

    if (auth && auth.user) {
        
      if (auth.user.email === "vhalme@gmail.com") {
        adminElem = (
          <span>
            <a className={s.link} href="/api/users">
              Hallinta
            </a>
            <span className={s.spacer}> | </span>
          </span>
        );
      }

      const accountUrl = `/account`; //${auth.user.uuid}`;
      loginElem = (
        <span>
          {adminElem}  
          <a className={s.link} href={accountUrl} onClick={Link.handleClick}>
            {auth.user.email}
          </a>
          <span className={s.spacer}> | </span>
          <a className={s.link} href="/logout">
            Ulos
          </a>
        </span>
      );

    } else {

      loginElem = (
        <a className={s.link} href="/login" onClick={Link.handleClick}>
          {this.getIntlMessage("login")}
        </a>
      );

    }

    return (
      <div className={cx(s.root, this.props.className)} role="navigation">
        <a className={s.link} href="/about" onClick={Link.handleClick}>
          {this.getIntlMessage("about")}
        </a>
        <span className={s.spacer}> | </span>
        {loginElem}
      </div>
    );
  }

}

export default Navigation;
