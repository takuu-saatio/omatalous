import React, { Component, PropTypes } from 'react';
import s from './LoginPage.scss';
import withStyles from '../../decorators/withStyles';

const title = 'Log In';

@withStyles(s)
class LoginPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = props.state;
  }

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.state);
  }

  render() {
    
    console.log("render lp, props: ", this.props);
    const { login, register, loginOrRegister } = this.props;
    
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <p>...</p>
          <p>Status: {this.state.login}</p>
          <button onClick={() => loginOrRegister()}>Login</button>
          <button onClick={() => register()}>Register</button>
        </div>
      </div>
    );
  }

}

export default LoginPage;
