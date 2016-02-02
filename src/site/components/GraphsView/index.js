import React, { Component, PropTypes } from "react";
import s from "./GraphsView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import SelectField from "material-ui/lib/select-field";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";

import {
  PieChart,
  LineChart,
  AreaChart
} from "react-d3";


@withStyles(s)
class GraphsView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.categoryLabels = {
      "shopping": "Ostokset",
      "misc": "Muut",
      "groceries": "Ruokakauppa"
    };
    const state = props.state;
    state.catParams = {
      graphs: "categories,forecast",
      sign: "-",
      start: "2016-02",
      end: "2016-02"
    };
    
    this.state = state;
  
  }

  async fetchData(props = this.props) { 
    const user = this.props.params.user || this.state.auth.user.uuid; 
    console.log("fetching graphs", user);
    this.props.fetchGraphStats(user, this.state.catParams);
  }

  updateState(state) {
    
    const { stats } = state;
    
    if (stats) {
      this.setState(state); 
    }

  }
   
  _handleCatTypeChange(event, index, value) {
    this._handleFormChange("catParams", "sign", value);
  }

  _handleFormChange(target, name, value) {
    
    let formParams = {};
    formParams[name] = value;
    let object = Object.assign(this.state[target], formParams);
    this.state[target] = object;
    this.fetchData();

  }
  
  _monthDec(target, key) {
    
    let monthElems = target[key].split("-");
    let [ prevYear, prevMonth ] = monthElems;
    if (prevMonth === "01") {
      prevYear = parseInt(prevYear) - 1;
      prevMonth = "12";
    } else {
      let monthPadding = parseInt(prevMonth) < 11 ? "0" : "";
      prevMonth = monthPadding + (parseInt(prevMonth) - 1);
    }
    
    target[key] = prevYear + "-" + prevMonth;
    console.log("month dec", target[key], this.state.catParams);
    this.fetchData();
 
  }
  
  _monthInc(target, key) {
    
    let monthElems = target[key].split("-");
    let [ nextYear, nextMonth ] = monthElems;
    if (nextMonth === "12") {
      nextYear = parseInt(nextYear) + 1;
      nextMonth = "01";
    } else {
      let monthPadding = parseInt(nextMonth) < 9 ? "0" : "";
      nextMonth = monthPadding + (parseInt(nextMonth) + 1);
    }

    target[key] = nextYear + "-" + nextMonth;
    this.fetchData();
  
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
    let forecastElem = null;
    let progressElem = null;
    
    if (stats) {
      
      if (stats.categories) {
        
        const catKeys = Object.keys(stats.categories);
        const chartColumns = catKeys.map(catKey => [this.categoryLabels[catKey], 
          stats.categories[catKey]]);
        
        const chartData = {
          bindto: "#catChart",
          data: {
            columns: chartColumns,
            type : "pie",
            //onclick: function (d, i) { console.log("onclick", d, i); },
            //onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            //onmouseout: function (d, i) { console.log("onmouseout", d, i); }
          }
        };
 
        const categories = this._createCategoriesData(stats.categories);
        require(["d3", "c3"], function(d3, c3) {
          c3.generate(chartData);
        });

        categoriesElem = (
          <div className={s.graph}>
            <div className={s.graphLabel}>
              Kulutusjakauma
            </div>
            <div className={s.chartSettings}>
              <div className={s.signSelector}>
                <SelectField style={{ width: "100%" }} value={this.state.catParams.sign} 
                  onChange={this._handleCatTypeChange.bind(this)}>
                  <MenuItem value="-" primaryText="Menot"/>
                  <MenuItem value="+" primaryText="Tulot"/>
                </SelectField>
              </div>
              <div className={s.range}>
                <div className={s.monthSelector}>
                  <div className={s.selectorLabel}>
                    Alkaen
                  </div>
                  <div className={s.monthDec} 
                    onTouchTap={() => this._monthDec(this.state.catParams, "start")}>
                    <i className="material-icons">&#xE5CB;</i>
                  </div>
                  <div className={s.monthLabel}>{this.state.catParams.start}</div>
                  <div className={s.monthInc}
                    onTouchTap={() => this._monthInc(this.state.catParams, "start")}>
                    <i className="material-icons">&#xE5CC;</i>
                  </div>
                </div>
                <div className={s.monthSelector}>
                  <div className={s.selectorLabel}>
                    Asti
                  </div>
                  <div className={s.monthDec}
                    onTouchTap={() => this._monthDec(this.state.catParams, "end")}>
                    <i className="material-icons">&#xE5CB;</i>
                  </div>
                  <div className={s.monthLabel}>{this.state.catParams.end}</div>
                  <div className={s.monthInc}
                    onTouchTap={() => this._monthInc(this.state.catParams, "end")}>
                    <i className="material-icons">&#xE5CC;</i>
                  </div>
                </div>
              </div>
            </div>
            <div className={s.graphContainer} style={{ width: `${graphSize}px` }}>
              <div id="catChart"></div>
            </div>
          </div>
        );
      
      }

      if (stats.forecast) {
        
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const x1 = [ "x1", firstDay ];
        const data1 = [ "Toistuvat", 0 ];
        stats.forecast.repeating.forEach(val => {
          x1.push(new Date(val.x));
          data1.push(val.y);
        });
        
        x1.push(lastDay);
        data1.push(data1[data1.length - 1]);
        
        const x2 = [ "x2", firstDay ]; 
        const data2 = [ "Toteutuneet", 0 ];
        stats.forecast.actual.forEach(val => {
          x2.push(new Date(val.x));
          data2.push(val.y);
        });
 
        const chartData = {
          bindto: "#chart",
          data: {
            xs: {
                "Toistuvat": "x1",
                "Toteutuneet": "x2",
            },
            columns: [
                x1,
                x2,
                data1,
                data2
            ],
            types: {
              "Toistuvat": "area-spline",
              "Toteutuneet": "spline"
            }
          },
          axis: {
            x: {
              type: "timeseries",
              tick: {
                format: "%d"
              }
            }
          },
          tooltip: {
            format: {
              title: function (d) { return d.getDate() + "." + d.getMonth(); },
              value: function (value, ratio, id) {
                  return value + "€";
              }
            }  
          }
        }

        forecastElem = (   
          <div className={s.graph}>
            <div className={s.graphLabel}>
              Tilanne/ennuste
            </div>
            <div className={s.graphContainer} style={{ width: `${graphSize}px` }}>
              <div id="chart"></div>
            </div>
          </div>
        );
        
        require(["d3", "c3"], function(d3, c3) {
          c3.generate(chartData);
        });

      }

      if (true) {
        
        var progressData = {
          bindto: "#progressChart",
          data: {
            columns: [
              ['data1_1', 30, 200, 200, 400, 150, 250],
              ['data1_2', 130, 100, 100, 200, 150, 50],
              ['data1_3', 230, 200, 200, 300, 250, 250],
              ['data2_1', 60, 120, 130, 380, 140, 258],
              ['data2_2', 180, 90, 90, 210, 160, 40],
              ['data2_3', 250, 230, 190, 280, 230, 210],
              ['saving', 60, -62, 46, 56, 42 ]
            ],
            type: "bar",
            types: {
              "saving": "line" 
            },
            groups: [
              ["data1_1", "data1_2", "data1_3"],
              ["data2_1", "data2_2", "data2_3"]
            ]
          },
          grid: {
            y: {
              lines: [{value:0}]
            }
          }
        };
        
        progressElem = (   
          <div className={s.graph}>
            <div className={s.graphLabel}>
              Kehitys
            </div>
            <div className={s.graphContainer} style={{ width: `${graphSize}px` }}>
              <div id="progressChart"></div>
            </div>
          </div>
        );
        
        require(["d3", "c3"], function(d3, c3) {
          c3.generate(progressData);
        });
      
      }
          
    }
    
    console.log("cat elem", categoriesElem); 
    
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
