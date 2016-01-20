import React, { Component, PropTypes } from "react";
import s from "./GraphsView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";

import {
  PieChart
} from "react-d3";

@withStyles(s)
class GraphsView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.categoryLabels = {
      "misc": "Sekalaiset",
      "groceries": "Ruokakauppa"
    };
    this.state = props.state;
  }

  async fetchData(props = this.props) { 
    const user = this.props.params.user || this.state.auth.user.uuid; 
    console.log("fetching graphs", user);
    this.props.fetchGraphStats(user);
  }

  updateState(state) {
    
    const { stats } = state;
    
    if (stats) {
      this.setState(state); 
    }

  }
  
  _createCategoriesData(categories) {
    
    const categoriesData = [];
    const keys = Object.keys(categories);
    keys.forEach(key => {
      categoriesData.push({ label: key, value: categories[key] });
    });
    
    return categoriesData;  
  
  }
   
  render() {
     
    const { stats } = this.state;
    
    console.log("rendering graphs", window.innerWidth, this.state);
    
    const graphSize = window.innerWidth >= 420 ? 420 : 300; 
    
    let categoriesElem = null;
    
    if (stats) {
      
      if (stats.categories) {
        
        const categories = this._createCategoriesData(stats.categories);
        const pieChart = 
          <PieChart data={categories}
            legend={true}
            radius={graphSize * 0.48}
            width={graphSize}
            height={graphSize}
            innerRadius={20}
            sectorBorderColor="white"
            showOuterLabels={false}
            valueTextFormatter={val => `${val}`}
          />;

        const colorMap = {};
        categories.forEach(category => {
          colorMap[category.label] = pieChart.props.colors(category.value);
        });
        
        console.log("PIE PROPS", colorMap);
        
        categoriesElem = (
          <div className={s.graph}>
            <div className={s.graphLabel}>
              Kulutusjakauma
            </div>
            <div className={s.graphContainer} style={{ width: `${graphSize}px` }}>
              {pieChart}
            </div>
          </div>
        );
      }
    }
    
    console.log("cat elem", categoriesElem);

    return (
      <div>
        <div className={s.root}>
          {categoriesElem}
        </div>
      </div>
    );
  }

}

export default GraphsView;
