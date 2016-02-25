"use strict";

import React, { Component, PropTypes } from "react";
import s from "./GraphsView.scss";
import withStyles from "../../decorators/withStyles";
import SelectField from "material-ui/lib/select-field";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import CircularProgress from "material-ui/lib/circular-progress";
import { staticCategories } from "../../constants";

class ForecastChart extends Component {
  
  constructor(props) {
    super(props);    
  }

  _renderChartContent(data) {
    
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const meta = {
      "Toistuvat": [],
      "Toteutuneet": []
    };
    
    const dayNames = [ "Su", "Ma", "Ti", "Ke", "To", "Pe", "La" ];

    const x1 = [ "x1", firstDay ];
    const data1 = [ "Toistuvat", 0 ];
    data.repeating.forEach(val => {
      x1.push(new Date(val.x));
      data1.push(val.y);
      meta["Toistuvat"].push(val.txs);
    });
    
    x1.push(lastDay);
    data1.push(data1[data1.length - 1]);
    
    const x2 = [ "x2", firstDay ]; 
    const data2 = [ "Toteutuneet", 0 ];
    data.actual.forEach(val => {
      x2.push(new Date(val.x));
      data2.push(val.y);
      meta["Toteutuneet"].push(val.txs);
    });

    const chartData = {
      bindto: "#forecastChart",
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
          "Toistuvat": "spline",
          "Toteutuneet": "spline"
        }
      },
      axis: {
        x: {
          label: "päivä",
          type: "timeseries",
          tick: {
            format: x => dayNames[x.getDay()] + " " + x.getDate(),
            rotate: 75,
            multiline: false
          }
        },
        y: {
          label: "euroa kertynyt"
        }
      },
      grid: {
        y: {
          lines: [{value:0}]
        }
      },
      tooltip: {
        grouped: false,
        contents: (d, defaultTitleFormat, defaultValueFormat, color) => {
          const month = d[0].x.getMonth() + 1;
          const day = d[0].x.getDate();
          let dateTitle = dayNames[d[0].x.getDay()] + " " + 
            (day < 10 ? "0" + day : day) + "." +
            (month < 10 ? "0" + month : month);
          let htmlContent = "";
          d.forEach(point => {
            
            if (point.index === 0) {
              htmlContent += "<div>Alku</div>";
              return;
            }
            
            htmlContent += `<div style="display: flex;">`;

            htmlContent += `<div style="flex: 1 1 auto;">`;
            
            if (point.id && meta[point.id][point.index - 1]) {
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
              
              htmlContent += `<div style="flex: 1 1 auto;">`;
              meta[point.id][point.index - 1].forEach(tx => {
                const color = tx.sign === "+" ? "green" : "red";
                htmlContent += `
                <div style="
                  border-top: 1px solid #a0a0a0;
                  padding-top: 2px;
                  padding-bottom: 2px;
                  text-align: right;
                  display: block;
                  position: relative;">
                    <span style="
                      color: ${color};
                      margin-left: 6px;
                      margin-right: 4px;
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
            }

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
      }
    }

    const chartContent = (   
      <div className={s.chartContent}>
        <div id="forecastChart"></div>
      </div>
    );

    require(["d3", "c3"], function(d3, c3) {
      console.log("forecast chart data", chartData);
      c3.generate(chartData);
    
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
          Tilanne/ennuste
        </div>
        <div className={s.graphContainer} style={{ width: `${this.props.graphSize}px` }}>
          {chartContent}
        </div>
      </div>
    );

  }

}

export default ForecastChart;
