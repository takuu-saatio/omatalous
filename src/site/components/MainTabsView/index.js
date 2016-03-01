import React, { Component, PropTypes } from "react";
import s from "./InsightsView.scss";
import withStyles from "../../decorators/withStyles";
import Tabs from "material-ui/lib/tabs/tabs";
import Tab from "material-ui/lib/tabs/tab";
import SwipeableViews from "react-swipeable-views";
import BaseComponent from "../BaseComponent";

import {
  ConsumptionContainer,
  GraphsContainer
} from "../../containers";

@withStyles(s)
export default class MainTabsView extends BaseComponent {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    console.log("constr main tabs", props);
    this.state = props.state;
  }

  _setTab = (tab) => {
    this.setState({
      tab: tab
    });
  };

  _tabLabelCss(index) {
    if (this.state.tab === index) {
      return { color: "black", backgroundColor: "white" };
    } else {
      return { color: "black", backgroundColor: "#f0f0f0" };
    }
  }

  render() {

    console.log("render main tabs", this.state);
    
    let contentElem = null;
    if (this.state.tab === 1) {
      contentElem = <GraphsContainer params={this.props.params} />;
    } else {
      contentElem = <ConsumptionContainer params={this.props.params} />;
    }
    
    const inkBarStyle = {
      backgroundColor: "#00bcd4",
      //backgroundColor: "#f0f0f0",
      height: "2px",
      bottom: "0px"
    };
 
    return (
      <div>
        <Tabs inkBarStyle={inkBarStyle} 
          tabItemContainerStyle={{ backgroundColor: "#f0f0f0" }}
          onChange={this._setTab}
          value={this.state.tab}>
          <Tab label="Tapahtumat" value={0} style={this._tabLabelCss(0)}/>
          <Tab label="Graafit" value={1} style={this._tabLabelCss(1)} />
        </Tabs>
        <div>
          <div className={s.insightContainer}>
            {contentElem}
          </div>
        </div>
      </div>
    );
  }
}
