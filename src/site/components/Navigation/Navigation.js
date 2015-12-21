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
    const loginElem = !(auth && auth.user) ? (
      <a className={s.link} href="/login" onClick={Link.handleClick}>
        {this.getIntlMessage("login")}
      </a>
    ) : (
      <a className={s.link} href="/logout">
        Ulos
      </a>
    )

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
