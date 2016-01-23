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

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
  },
};

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
      return { color: "black" };
    } else {
      return { color: "rgba(0, 0, 0, 0.6)" };
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
    
     
    return (
      <div>
        <Tabs inkBarStyle={{ backgroundColor: "#a0a0a0" }} 
          tabItemContainerStyle={{ backgroundColor: "#f0f0f0" }}
          onChange={this._setTab}
          value={this.state.tab}>
          <Tab label="Kulutus" value={0} style={this._tabLabelCss(0)}/>
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
