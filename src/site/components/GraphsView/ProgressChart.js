"use strict";
import React, { Component, PropTypes } from "react";
import s from "./GraphsView.scss";
import withStyles from "../../decorators/withStyles";
import SelectField from "material-ui/lib/select-field";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import CircularProgress from "material-ui/lib/circular-progress";
import { staticCategories } from "../../constants";

class ProgressChart extends Component {
  
  constructor(props) {
    super(props);    
  }

  _renderChartContent(data) {
    
    const months = Object.keys(data);
    const valsByCat = {};
    
    months.forEach(month => {
      
      const cats = data[month];
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
       
      const cats = data[month];
      
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
    
    months.unshift("x");
    progressColumns.unshift(months);

    console.log("PROG CHART DATA", progressColumns, progressGroups);
    
    const progressData = {
      bindto: "#progressChart",
      data: {
        x: "x",
        columns: progressColumns,
        type: "bar",
        types: {
          "Säästö": "line" 
        },
        groups: progressGroups,
        order: "asc"
      },
      grid: {
        y: {
          lines: [{value:0}]
        }
      },
      axis: {
        x: {
          label: "Kuukausi",
          type: "category",
          tick: {
            rotate: 75,
            multiline: false
          }
        },
        y: {
          label: "Tulot / menot €"
        }
      },
      legend: {
        show: false
      },
      tooltip: {
        format: {
          value: value => value + " €"
        }
      }
    };
    
    const legendTitleCss = {
      textAlign: "center",
      font: "14px sans-serif"   
    };

    const chartContent = (   
      <div className={s.chartContent}>
        <div id="progressChart" style={{}}></div>
        <div id="progressLegend" style={{ paddingLeft: "24px", display: "flex" }}>
          <div id="incomeLegend" style={{ flex: "1 1" }}>
            <div style={legendTitleCss}>Tulot</div>
          </div>
          <div id="expenseLegend" style={{ flex: "1 1" }}>
            <div style={legendTitleCss}>Menot</div>
          </div>
        </div>
      </div>
    );
    
    const incomeColumns = progressColumns
      .filter(column => column[0].substring(0, 1) === "+"); 
    const expenseColumns = progressColumns
      .filter(column => column[0].substring(0, 1) === "-");

    require(["d3", "c3"], function(d3, c3) {
      
      const chart = c3.generate(progressData);
      
      const setLegend = (element, columns) => {

        d3.select(element).insert("div", ".chart")
        .attr("class", "legend").selectAll(".legend-item").data(columns)
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
            <span>${data[0].substring(2)}</span>
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
      };
    
      setLegend("#incomeLegend", incomeColumns);
      setLegend("#expenseLegend", expenseColumns);      

    });

    return chartContent;

  }

  render() {
        
    let chartContent = this.props.data ?
      this._renderChartContent(this.props.data) : <CircularProgress />;
    
    return (   
      <div className={s.graph}>
        <div className={s.graphLabel}>
          Kehitys
        </div>
        <div className={s.graphContainer} style={{ width: `${this.props.graphSize}px` }}>
          {chartContent}
        </div>
      </div>
    );

  }

}

export default ProgressChart;  
