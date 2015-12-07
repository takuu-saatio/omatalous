/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
import s from './LoginPage.scss';
import withStyles from '../../decorators/withStyles';

const title = 'Log In';

@withStyles(s)
class LoginPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  render() {
    
    const { login, register, loginOrRegister, status } = this.props
    console.log("status", status);
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <p>...</p>
          <p>Status: {status}</p>
          <button onClick={() => login()}>Login</button>
          <button onClick={() => register()}>Register</button>
        </div>
      </div>
    );
  }

}

export default LoginPage;
