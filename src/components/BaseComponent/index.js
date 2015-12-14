"use strict";

import React, { Component, PropTypes } from "react";

class BaseComponent extends Component {
  
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (!props.iso) {
      this.fetchData();
    }
  }

  componentWillMount() {
    super.componentWillMount();
  }

  fetchData() {
  }
  
}

export default LoginPage;
