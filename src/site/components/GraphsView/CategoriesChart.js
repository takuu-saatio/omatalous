"use strict";
import React, { Component, PropTypes } from "react";
import s from "./GraphsView.scss";
import withStyles from "../../decorators/withStyles";
import SelectField from "material-ui/lib/select-field";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import { staticCategories } from "../../constants";

class CategoriesChart extends Component {
  
  constructor(props) {

    super(props);    
    this.state = {
      catParams: {
        graphs: "categories,forecast,progress",
        sign: "-",
        start: "2016-02",
        end: "2016-02"
      }
    };

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

  render() {
    
    const catKeys = Object.keys(this.props.categories);
    const chartColumns = catKeys.map(catKey => {
      const catLabels = this.state.catParams.sign === "+" ?
        staticCategories.income : staticCategories.expenses;
      return [catLabels[catKey], this.props.categories[catKey]]
    });

    const chartData = {
      bindto: "#catChart",
      data: {
        columns: chartColumns,
        type : "donut",
        //onclick: function (d, i) { console.log("onclick", d, i); },
        //onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        //onmouseout: function (d, i) { console.log("onmouseout", d, i); }
      },
      legend: {
        show: false
      }
    };
    
    const chartElem = (
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
        <div className={s.graphContainer} style={{ width: `${this.props.graphSize}px` }}>
          <div id="catChart"></div>
          <div id="catLegend"></div>
        </div>
      </div>
    );
    
    const sortedColumns = chartColumns.sort((a, b) => b[1] - a[1]);
    const categories = this._createCategoriesData(this.props.categories); 
    require(["d3", "c3"], function(d3, c3) {
      
      const chart = c3.generate(chartData);
       
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
      .each(function(data) {
        //d3.select(this).style("background-color", chart.color(data[0]));
      })
      .on("mouseover", function(data) {
        d3.select(this).style("font-weight", "bold");
        chart.focus(data[0]);
      })
      .on("mouseout", function(data) {
        d3.select(this).style("font-weight", "inherit");
        chart.revert();
      });
    
    });

    return chartElem;

  }

}

export default CategoriesChart;
