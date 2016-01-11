import React from "react";
import s from "./InsightsView.scss";
import withStyles from "../../../decorators/withStyles";
import Tabs from "material-ui/lib/tabs/tabs";
import Tab from "material-ui/lib/tabs/tab";
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from "react-swipeable-views";

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
export default class InsightsView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}>
          <Tab label="Kulutus" value={0} />
          <Tab label="Säästäminen" value={1} />
          <Tab label="Tilastot" value={2} />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}>
          <div className={s.insightContainer}>
            <div className={s.circleContainer}>
              <div className={s.circle}>
                101.34€
              </div>
            </div>
          </div>
          <div className={s.insightContainer}>
            <div className={s.circleContainer}>
              <div className={s.circle}>
                10000€
              </div>
            </div>
          </div>
          <div className={s.insightContainer}>
            TILASTOGRAAFIT
          </div>
        </SwipeableViews>
      </div>
    );
  }
}
