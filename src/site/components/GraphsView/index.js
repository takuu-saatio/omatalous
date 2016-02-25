import React, { Component, PropTypes } from "react";
import s from "./GraphsView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import SelectField from "material-ui/lib/select-field";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import CircularProgress from "material-ui/lib/circular-progress";
import BaseComponent from "../BaseComponent";
import CategoriesChart from "./CategoriesChart";
import ForecastChart from "./ForecastChart";
import ProgressChart from "./ProgressChart";
import { staticCategories } from "../../constants";


@withStyles(s)
class GraphsView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const state = props.state; 
    this.state = state;
  
  }

  async fetchData(props = this.props, params) { 
    const user = this.props.params.user || this.state.auth.user.uuid; 
    console.log("fetching graphs", user);
    this.props.fetchGraphStats(user, params || { 
      sign: "-", 
      graphs: "categories,forecast,progress" 
    });
  }

  updateState(state) {
    
    const { stats } = state;
    
    if (stats) {
      this.setState(state); 
    }

  } 
   
  render() {
    
    const { stats } = this.state;
    const [
      categoriesData,
      forecastData,
      progressData
    ] = 
    stats ? [
      stats.categories,
      stats.forecast,
      stats.progress
    ] :
    [ null, null, null ];

    console.log("rendering graphs", window.innerWidth, this.state);
    
    let graphSize = window.innerWidth;
    
    if (window.innerWidth >= 640) {
      graphSize = 600;
    } 
    
    const categoriesElem = <CategoriesChart 
      data={categoriesData}
      customCategories={this.state.categories}
      fetchData={this.fetchData.bind(this)}
      graphSize={graphSize} />
      
    const forecastElem = <ForecastChart 
      data={forecastData}
      graphSize={graphSize} />

    const progressElem = <ProgressChart 
      data={progressData}
      customCategories={this.state.categories}
      graphSize={graphSize} />
           
    return (
      <div>
        <div className={s.root}>
          {categoriesElem}
          {forecastElem}
          {progressElem}
        </div>
      </div>
    );
  }

}

export default GraphsView;
