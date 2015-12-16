"use strict";

import React, { Component, PropTypes } from "react";

class BaseComponent extends Component {
    
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this._fetchIfUpdated(nextProps);
    this.state = nextProps.state;
  }
   
  componentDidMount() {
    this._fetchIfUpdated(this.props);
  }
  
  _fetchIfUpdated(props) { 
    
    if (!props.state.iso) {
      this.fetchData(props);
    } else {
      props.state.iso = false;
    }

  }

  fetchData() {
  }

}

export default BaseComponent;
