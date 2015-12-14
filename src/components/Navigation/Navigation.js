"use strict";

import React, { Component, PropTypes } from "react";
import cx from "classnames";
import s from "./Navigation.scss";
import withStyles from "../../decorators/withStyles";
import Link from "../Link";

@withStyles(s)
class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    return (
      <div className={cx(s.root, this.props.className)} role="navigation">
        <a className={s.link} href="/about" onClick={Link.handleClick}>Sovellus</a>
        <span className={s.spacer}> | </span>
        <a className={s.link} href="/login" onClick={Link.handleClick}>Käytä</a>
      </div>
    );
  }

}

export default Navigation;
