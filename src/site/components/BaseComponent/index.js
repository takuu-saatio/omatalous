"use strict";

import React, { Component, PropTypes } from "react";

class BaseComponent extends Component {
    
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    console.log("bc will rec props", nextProps);
    this._fetchIfUpdated(nextProps);
    this.updateState(nextProps.state);
  }
   
  componentDidMount() {
    this._fetchIfUpdated(this.props);
  }
  
  _fetchIfUpdated(props) { 
    
    if (!props.state.iso && !props.state.isUpdated) {
      this.fetchData(props);
    } else {
      props.state.iso = false;
      props.state.isUpdated = false;
    }

  }

  fetchData() {
  }

  updateState(state) {
    this.setState(Object.assign(this.state, state));
  }

}

export default BaseComponent;
