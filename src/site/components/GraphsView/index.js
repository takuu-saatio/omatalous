import React, { Component, PropTypes } from "react";
import s from "./GraphsView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import SelectField from "material-ui/lib/select-field";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";
import { staticCategories } from "../../constants";


@withStyles(s)
class GraphsView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const state = props.state;
    state.catParams = {
      graphs: "categories,forecast,progress",
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
    
    const weekDays = [ "Su", "Ma", "Ti", "Ke", "To", "Pe", "La" ];
    
    let categoriesElem = null;
    let forecastElem = null;
    let progressElem = null;
    
    if (stats) {
      
      if (stats.categories) {
        
        const catKeys = Object.keys(stats.categories);
        const chartColumns = catKeys.map(catKey => {
          const catLabels = this.state.catParams.sign === "+" ?
            staticCategories.income : staticCategories.expenses;
          return [catLabels[catKey], stats.categories[catKey]]
        });
        
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

        const meta = {
          "Toistuvat": [],
          "Toteutuneet": []
        };

        const x1 = [ "x1", firstDay ];
        const data1 = [ "Toistuvat", 0 ];
        stats.forecast.repeating.forEach(val => {
          x1.push(new Date(val.x));
          data1.push(val.y);
          meta["Toistuvat"].push(val.txs);
        });
        
        x1.push(lastDay);
        data1.push(data1[data1.length - 1]);
        
        const x2 = [ "x2", firstDay ]; 
        const data2 = [ "Toteutuneet", 0 ];
        stats.forecast.actual.forEach(val => {
          x2.push(new Date(val.x));
          data2.push(val.y);
          meta["Toteutuneet"].push(val.txs);
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
            grouped: false,
            contents: (d, defaultTitleFormat, defaultValueFormat, color) => {

              const month = d[0].x.getMonth() + 1;
              const day = d[0].x.getDate();
              let dateTitle = weekDays[d[0].x.getDay()] + " " + 
                (day < 10 ? "0" + day : day) + "." +
                (month < 10 ? "0" + month : month);
              let htmlContent = "";
              d.forEach(point => {
                
                if (point.index === 0) {
                  htmlContent += "<div>Alku</div>";
                  return;
                }
                
                htmlContent += `<div>`;

                htmlContent += `<div style="display: inline-block;">`;
                meta[point.id][point.index - 1].forEach(tx => {
                  const catLabels = tx.sign === "+" ?
                    staticCategories.income : staticCategories.expenses;
                  const text = tx.description || catLabels[tx.category];
                  htmlContent += `
                    <div style="
                      border-top: 1px solid #a0a0a0;
                      padding-top: 2px;
                      padding-bottom: 2px;
                      ">
                      <span style="
                        margin-left: 4px;
                        margin-right: 6px;">
                        ${text}
                      </span>
                    </div>`;
                });
                htmlContent += "</div>";
                
                htmlContent += `<div style="display: inline-block;">`;
                meta[point.id][point.index - 1].forEach(tx => {
                  const color = tx.sign === "+" ? "green" : "red";
                  htmlContent += `
                  <div style="
                    border-top: 1px solid #a0a0a0;
                    padding-top: 2px;
                    padding-bottom: 2px;
                    text-align: right;
                    position: relative;">
                      <span style="
                        margin-left: 6px;
                        margin-right: 4px;
                        color: ${color}
                        ">
                        ${tx.sign}${tx.amount}€
                      </span>
                      <div style="
                        border-left: 1px dotted #a0a0a0;
                        width: 2px;
                        height: calc(100% - 2px); 
                        top: 1px; 
                        position: absolute;">
                      </div>
                    </div>`;
                });
                htmlContent += "</div>";
                
                htmlContent += "</div>";

              });

              return `
                <div style="
                  font-size: 14px;
                  background-color: white;
                  opacity: 0.9;
                  border: 1px solid #a0a0a0;">
                  <div style="
                    background-color: #c0c0c0;
                    color: white;
                    font-weight: bold;
                    padding-left: 4px;">
                    ${dateTitle}
                  </div>
                  ${htmlContent}
                </div>`;
            } 
            /*
            format: {
              title: function (d) { return d.getDate() + "." + d.getMonth(); },
              value: function (value, ratio, id) {
                  return value + "€";
              }
              }*/  
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

      if (stats.progress) {

        const months = Object.keys(stats.progress);
        const valsByCat = {};
        
        months.forEach(month => {
          
          const cats = stats.progress[month];
          const income = Object.keys(cats.income);
          income.forEach(cat => {
            if (!valsByCat[`inc_${cat}`]) {
              valsByCat[`inc_${cat}`] = [ `inc_${cat}` ];
            }
          });

          const expenses = Object.keys(cats.expenses);
          expenses.forEach(cat => {
            if (!valsByCat[`exp_${cat}`]) {
              valsByCat[`exp_${cat}`] = [ `exp_${cat}` ];
            }
          });

        });
        
        const savingsColumn = [ "Säästö" ];

        months.forEach(month => {
          
          const cats = stats.progress[month];
          
          const catKeys = Object.keys(valsByCat);
          catKeys.forEach(catKey => {
            valsByCat[catKey].push(null);
          });
          
          const income = Object.keys(cats.income);
          let totalIncome = 0;
          income.forEach(cat => {
            const vals = valsByCat[`inc_${cat}`];
            vals[vals.length - 1] = cats.income[cat];
            totalIncome += cats.income[cat];
          });

          const expenses = Object.keys(cats.expenses);
          let totalExpenses = 0;
          expenses.forEach(cat => {
            const vals = valsByCat[`exp_${cat}`];
            vals[vals.length - 1] = cats.expenses[cat];
            totalExpenses += cats.expenses[cat];
          });

          savingsColumn.push(totalIncome - totalExpenses);

        });
        
        
        const progressColumns = [];
        Object.keys(valsByCat).forEach(cat => {
          
          const vals = valsByCat[cat];
          if (vals[0].substring(0, 4) === "inc_") {
            vals[0] = "+ " + staticCategories.income[vals[0].substring(4)];
          } else {
            vals[0] = "- " + staticCategories.expenses[vals[0].substring(4)];
          }

          progressColumns.push(vals);
       
        });

        savingsColumn[savingsColumn.length - 1] = null; 
        progressColumns.push(savingsColumn);

        const progressGroups = [[],[]];
        progressColumns.forEach(column => {
          if (column[0].substring(0, 1) === "+") {
            progressGroups[0].push(column[0]);
          } else {
            progressGroups[1].push(column[0]);
          }
        });
        
        console.log("PROG CHART DATA", progressColumns, progressGroups);

        const progressData = {
          bindto: "#progressChart",
          data: {
            columns: progressColumns,
            type: "bar",
            types: {
              "Säästö": "line" 
            },
            groups: progressGroups
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
