import React, { Component, PropTypes } from "react";
import s from "./InsightsView.scss";
import withStyles from "../../decorators/withStyles";
import Tabs from "material-ui/lib/tabs/tabs";
import Tab from "material-ui/lib/tabs/tab";
import SwipeableViews from "react-swipeable-views";
import BaseComponent from "../BaseComponent";

import {
  ConsumptionContainer
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

  render() {

    console.log("render main tabs", this.state);
    
    let contentElem = null;
    if (this.state.tab === 0) {
      contentElem = <ConsumptionContainer params={this.props.params} />
    } else {
      contentElem = (<div>hsjdjadj</div>);
    }
 
    return (
      <div>
        <Tabs
          onChange={this._setTab}
          value={this.state.tab}>
          <Tab label="Kulutus" value={0} />
          <Tab label="Graafit" value={1} />
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
