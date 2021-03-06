import React, { Component, PropTypes } from "react";
import s from "./ContentPage.scss";
import withStyles from "../../decorators/withStyles";
import BaseComponent from "../BaseComponent";

import http from "../../tools/http-client";

@withStyles(s)
class ContentPage extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = props.state;
  }

  async fetchData(props = this.props) { 
    const path = props.path || this.state.routing.path;
    console.log("fetch content from path", path);
    const response = await http.get("/api/content" + path);
    if (!response.error) {
      this.setState(response.content);
    }

  }

  _setTitle(meta) {
    if (meta && meta.title) {
      this.context.onSetTitle(meta.title);
    }
  }

  render() {
    
    console.log("render content", this.state, this.props); 
    this._setTitle(this.state.meta);
    
    return (
      <div>
        <div className={s.root}>
          <div className={s.container}>
            <div dangerouslySetInnerHTML={{ __html: this.state.content || "" }} />
          </div>
        </div>
      </div>
    );
  }

}

export default ContentPage;
