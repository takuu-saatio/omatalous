import React, { Component, PropTypes } from "react";
import s from "./GraphsView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import SelectField from "material-ui/lib/select-field";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
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
    
    console.log("rendering graphs", window.innerWidth, this.state);
    
    const graphSize = window.innerWidth >= 420 ? 420 : 300; 
    
    const weekDays = [ "Su", "Ma", "Ti", "Ke", "To", "Pe", "La" ];
    
    let categoriesElem = null;
    let forecastElem = null;
    let progressElem = null;
    
    if (stats) {
      
      if (stats.categories) {
        categoriesElem = <CategoriesChart 
          categories={stats.categories}
          fetchData={this.fetchData.bind(this)}
          graphSize={graphSize} />
      }

      if (stats.forecast) {
        forecastElem = <ForecastChart 
          data={stats.forecast}
          graphSize={graphSize} />
      }

      if (stats.progress) {
        progressElem = <ProgressChart 
          data={stats.progress}
          graphSize={graphSize} />
      }
          
    }
    
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
