"use strict";
import React, { Component, PropTypes } from "react";
import s from "./GraphsView.scss";
import withStyles from "../../decorators/withStyles";
import SelectField from "material-ui/lib/select-field";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import FlatButton from "material-ui/lib/flat-button";
import CircularProgress from "material-ui/lib/circular-progress";
import { staticCategories } from "../../constants";
import { mergeCategories } from "../../utils";

class CategoriesChart extends Component {
  
  constructor(props) {

    super(props);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    
    const currentMonth = 
      year + "-" +
      (month < 10 ? "0" + month : month);
    
    this.state = {
      catParams: {
        graphs: "categories,forecast,progress",
        sign: "-",
        start: currentMonth,
        end: currentMonth
      }
    };

  }

  _formatMonth(month) {
    const [ YYYY, MM ] = month.split("-");
    return MM + "/" + YYYY;
  }

  _handleCatTypeChange(event, index, value) {
    this._handleFormChange("catParams", "sign", value);
  }

  _handleFormChange(target, name, value) {
    
    let formParams = {};
    formParams[name] = value;
    let object = Object.assign(this.state[target], formParams);
    this.state[target] = object;
    this.props.fetchData(null, this.state.catParams);

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
    this.props.fetchData(null, this.state.catParams);
 
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
    this.props.fetchData(null, this.state.catParams);
  
  }

  _createCategoriesData(categories) {
    
    const categoriesData = [];
    const keys = Object.keys(categories);
    keys.forEach(key => {
      categoriesData.push({ label: key, value: categories[key] });
    });
    
    return categoriesData;  
  
  }

  _renderChartContent(data) {
    
    const incomeCategories = mergeCategories(
      staticCategories.income, this.props.customCategories, "income");
    const expenseCategories = mergeCategories(
      staticCategories.expenses, this.props.customCategories, "expense");
      
    const catKeys = Object.keys(data);
    const chartColumns = catKeys.map(catKey => {
      const catLabels = this.state.catParams.sign === "+" ?
        incomeCategories : expenseCategories;
      return [catLabels[catKey], data[catKey]]
    });
    
    let chart = null;
    const chartData = {
      bindto: "#catChart",
      data: {
        columns: chartColumns,
        type : "donut",
        onclick: function (d, i) { 
          chart.focus(d.id); 
        }
        //onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        //onmouseout: function (d, i) { console.log("onmouseout", d, i); }
      },
      legend: {
        show: false
      },
      tooltip: {
        show: false
      }
    };

    const buttonStyle = {
      minWidth: "initial",
      lineHeight: "18px"
    };

    const chartContent = (
      <div className={s.chartContent}>
        <div className={s.chartSettings}>
          <div className={s.signSelector}>
            <SelectField style={{ marginLeft: "8px", width: "calc(100% - 8px)" }} value={this.state.catParams.sign} 
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
              <div className={s.monthDec}>
                <FlatButton style={buttonStyle}
                  onTouchTap={() => this._monthDec(this.state.catParams, "start")}>
                  <i className="material-icons">&#xE5CB;</i>
                </FlatButton>
              </div>
              <div className={s.monthLabel}>
                {this._formatMonth(this.state.catParams.start)}
              </div>
              <div className={s.monthInc}>
                <FlatButton style={buttonStyle}
                  onTouchTap={() => this._monthInc(this.state.catParams, "start")}>
                  <i className="material-icons">&#xE5CC;</i>
                </FlatButton>
              </div>
            </div>
            <div className={s.monthSelector}>
              <div className={s.selectorLabel}>
                Asti
              </div>
              <div className={s.monthDec}>
                <FlatButton style={buttonStyle}
                  onTouchTap={() => this._monthDec(this.state.catParams, "end")}>
                  <i className="material-icons">&#xE5CB;</i>
                </FlatButton>
              </div>
              <div className={s.monthLabel}>
                {this._formatMonth(this.state.catParams.end)}
              </div>
              <div className={s.monthInc}>
                <FlatButton style={buttonStyle}
                  onTouchTap={() => this._monthInc(this.state.catParams, "end")}>
                  <i className="material-icons">&#xE5CC;</i>
                </FlatButton>
              </div>
            </div>
          </div>
        </div>
        <div className={s.graphContainer} style={{ width: `${this.props.graphSize}px` }}>
          <div id="catChart"></div>
          <div id="catLegend"></div>
        </div>
      </div>
    );
  
    const sortedColumns = chartColumns.sort((a, b) => b[1] - a[1]);
    const categories = this._createCategoriesData(data); 
    require(["d3", "c3"], function(d3, c3) {
      
      chart = c3.generate(chartData);

      const legenElem = 
      d3.select("#catLegend").selectAll("*").remove();
      d3.select("#catLegend").insert("div", ".chart")
      .attr("class", "legend").selectAll(".legend-item").data(sortedColumns)
      .enter().append("div")
      .attr("data-id", data => data[0])
      .attr("class", "legend-item")
      .html(data => {
        const color = chart.color(data[0]);
        return `
          <div style="
            width: 12px;
            height: 12px;
            display: inline-block;
            background-color: ${color};">
          </div>
          <span>${data[0]}</span>
          <div style="
            float: right;
            display: inline-block;">
            ${data[1]} €
          </div>
        `;
      })
      .each(function(data, i, x, y) {
        //d3.select(this).style("background-color", chart.color(data[0]));
      })
      .on("click", function(data) {
        
        d3.selectAll(".legend-item").data(sortedColumns)
        .each(function(elemData) {
          if (elemData[0] === data[0]) {
            d3.select(this).style("font-weight", "bold");
            chart.focus(data[0]);
          } else {
            d3.select(this).style("font-weight", "inherit");
            chart.defocus(elemData[0]);
          }
        });

      })
      .on("mouseover", function(data) {
        d3.select(this).style("font-weight", "bold");
        chart.focus(data[0]);
      })
      .on("mouseout", function(data) {
        d3.select(this).style("font-weight", "inherit");
        chart.revert();
      });

      console.log("chart data", chart.data);
    
    });

    return chartContent;

  }

  render() {
    
    let chartContent = <CircularProgress />;
    
    if (this.props.data) {
      chartContent = this._renderChartContent(this.props.data);
    }

    return (
      <div className={s.graph}>
        <div className={s.graphLabel}>
          Kulutusjakauma
        </div>
        <div className={s.graphContainer} style={{ width: `${this.props.graphSize}px` }}>
          {chartContent}
        </div>
      </div>
    );

  }

}

export default CategoriesChart;
