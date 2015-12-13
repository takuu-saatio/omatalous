import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import s from './App.scss';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';

import CounterApp from '../../containers/App.js';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from '../../stores/configureStore'

class App extends Component {
  
  constructor(props) {
    super(props);
    let initialState = props.context.initialState || window.__INITIAL_STATE__;
    let reducers = props.context.reducers || window.__REDUCERS__;
    this.store = configureStore(initialState, reducers);
  }

  static propTypes = {
    context: PropTypes.shape({
      insertCss: PropTypes.func,
      onSetTitle: PropTypes.func,
      onSetMeta: PropTypes.func,
      onPageNotFound: PropTypes.func,
    }),
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
  };

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
      onSetTitle: context.onSetTitle || emptyFunction,
      onSetMeta: context.onSetMeta || emptyFunction,
      onPageNotFound: context.onPageNotFound || emptyFunction,
    };
  }

  componentWillMount() {
    this.removeCss = this.props.context.insertCss(s);
  }

  componentWillUnmount() {
    this.removeCss();
  }

  render() {
    
    return !this.props.error ? ( 
      <div>
        <Header />
        <Provider store={this.store}>
          {this.props.children}
        </Provider> 
        <Feedback />
        <Footer />
      </div>
    ) : this.props.children;
  }

}

export default App;
