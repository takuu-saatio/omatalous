"use strict";

import React, { Component } from "react";
import reactMixin from "react-mixin";
import ReactIntl from "react-intl";
import s from "./Header.scss";
import withStyles from "../../decorators/withStyles";
import Link from "../Link";
import Navigation from "../Navigation";

import BaseComponent from "../BaseComponent";

@withStyles(s)
class Header extends Component {
  
  render() {
    
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation auth={this.props.auth} className={s.nav} />
          <a className={s.brand} href="/" onClick={Link.handleClick}>
            <img src={require("./logo-small.png")} width="38" height="38" alt="React" />
            <span className={s.brandTxt}>Takuu-Säätiö</span>
          </a>
          <div className={s.banner}>
            <h1 className={s.bannerTitle}>Oma Talous</h1>
            <p className={s.bannerDesc}>Työkalu taloudenhallintaan</p>
          </div>
        </div>
      </div>
    );
  }

}

export default Header;
