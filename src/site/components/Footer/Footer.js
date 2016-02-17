/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import s from './Footer.scss';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';

@withStyles(s)
class Footer extends Component {

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <span className={s.text}>© Takuu-Säätiö</span>
          <span className={s.spacer}>·</span>
          <a className={s.link} href="/conditions" onClick={Link.handleClick}>Ehdot</a>
          <span className={s.spacer}>·</span>
          <a className={s.link} href="/instructions" onClick={Link.handleClick}>Ohjeet</a>
          <a className={s.link} href="http://www.ray.fi/">
            <img src="/RAY_Tukee.png"/>
          </a>
        </div>
      </div>
    );
  }

}

export default Footer;
