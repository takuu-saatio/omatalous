import React, { Component, PropTypes } from "react";
import s from "./ContentPage.scss";
import withStyles from "../../decorators/withStyles";
import BaseComponent from "../BaseComponent/BaseComponent";
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
    console.log("fetching data", props.path);
    const response = await http.get("/api/content" + props.path);
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
    
    console.log("contet state", this.state);    
    this._setTitle(this.state.meta);
    
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div dangerouslySetInnerHTML={{ __html: this.state.content || "" }} />
        </div>
        <button onClick={this.fetchData.bind(this)}>fetch</button>
      </div>
    );
  }

}

export default ContentPage;
