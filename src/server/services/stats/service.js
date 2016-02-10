"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/services/stats/service");

import { getCurrentMonth, getMonthLabel } from "../../../core/utils";

import { 
  BaseError,
  NotFound, 
  Unauthorized,
  UnprocessableEntity
} from "../../../core/errors"

class StatsService {
  
  constructor(app) {
    this.app = app;
  }
  
  _getCategoryStats(user, params) {
    
    const { Transaction } = this.app.entities;

    return new Promise((resolve, reject) => {

      const where = {
        user: user.uuid,
        $or: [ 
          { type: "single" },
          { type: "copy" } 
        ]
      };

      if (params.start || params.end) {
      
        where.month = {};
        
        if (params.start) {
          where.month.$gte = params.start;
          delete params.start;
        }
      
        if (params.end) {
          where.month.$lte = params.end;
          delete params.end;
        }

      }

      Object.assign(where, params);

      Transaction.schema.aggregate(
        "amount",
        "SUM",
        { 
          where,
          plain: false, 
          group: [ "category" ], 
          attributes: [ "category" ] 
        }
      )
      .then((rows) => {
        
        log.debug("AGGR RESULT", rows);
        const categories = {};
        for (let row of rows) {
          categories[row.category] = parseInt(row.SUM);
        }

        resolve(categories);      

      })
      .catch((err) => {
        log.debug("AGGR ERR", err);
        reject(err);
      });
       
    })

  }

  _getForecastStats(user, params) {
    
    const { Transaction } = this.app.entities;

    return new Promise(async (resolve, reject) => {

      try {

        const order = { order: "\"createdAt\" ASC" };
        let where = {
          user: user.uuid,
        };
        
        where.month = getCurrentMonth();
        where.$or = [ 
          { type: "single" },
          { type: "copy" } 
        ];
         
        const now = new Date();
        
        const actual = await Transaction.selectAll(where, order)
        const actualValsMap = {};
        
        for (let tx of actual) {
          const day = tx.createdAt.getDate();
          if (!actualValsMap[day]) {
            actualValsMap[day] = [];
          }
          actualValsMap[day].push(tx);
        }

        const actualVals = [];
        let balance = 0;
        for (let day of Object.keys(actualValsMap)) {
           
          let dailySum = 0;
          for (let tx of actualValsMap[day]) {
            const amount = tx.sign === "+" ? tx.amount : -tx.amount;
            dailySum += amount;
          }
          
          balance += dailySum;
          actualVals.push({
            txs: actualValsMap[day].map(tx => { 
              return {
                category: tx.category,
                description: tx.description, 
                amount: tx.amount,
                sign: tx.sign
              };
            }),
            x: new Date(now.getFullYear(), now.getMonth(), parseInt(day)),
            y: balance
          });

        }

        delete where.month;
        delete where.$or;
        where.type = "repeating";
         
        const repeating = await Transaction.selectAll(where)
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const repeatingMap = {
          M: [], W: [], D: []
        };
        
        for (let tx of repeating) {
          repeatingMap[tx.repeats].push(tx);
        }
        
        const repeatingValsMap = {};
        for (let day = 1; day <= lastDay.getDate(); day++) {
          repeatingValsMap[day] = [];
          if (repeatingMap.D.length > 0) {
            for (let tx of repeatingMap.D) {
              repeatingValsMap[day].push(tx);
            }
          }
        }
 
        if (repeatingMap.M.length > 0) {
          for (let tx of repeatingMap.M) {
            repeatingValsMap[tx.repeatValue].push(tx);
          }
        }

        if (repeatingMap.W.length > 0) {
          for (let tx of repeatingMap.W) {
            
            const daysInMonth = lastDay.getDate();
            const dayDiff = tx.repeatValue - firstDay.getDay();
            const dayOffset = dayDiff >= 0 ? dayDiff : 7 + dayDiff; 
            const dayOccurences = Math.floor((daysInMonth - dayOffset) / 7);
            let currentDay = dayOffset + 1;
            while (currentDay <= daysInMonth) { 
              repeatingValsMap[currentDay].push(tx);
              currentDay += 7;
            }

          }
        }
        
        const repeatingVals = []; 
        balance = 0;
        for (let day = 1; day <= lastDay.getDate(); day++) {

          let dailySum = 0;
          for (let tx of repeatingValsMap[day]) { 
            const amount = tx.sign === "+" ? tx.amount : -tx.amount;
            dailySum += amount;
          }
          
          if (dailySum !== 0) {
            balance += dailySum;
            repeatingVals.push({  
              txs: repeatingValsMap[day].map(tx => { 
                return {
                  category: tx.category,
                  description: tx.description, 
                  amount: tx.amount,
                  sign: tx.sign
                };
              }),
              x: new Date(now.getFullYear(), now.getMonth(), day),
              y: balance
            });
          }

        }

        const forecast = {
          actual: actualVals,
          repeating: repeatingVals
        };
        
        console.log("forecast stats", forecast);
        resolve(forecast);      
      
      } catch (err) {
        log.debug("FORECAST STATS ERR", err);
        reject(err);
      }
       
    });

  }
  
  _getProgressStats(user, params) {
      
    return new Promise(async (resolve, reject) => {

      const { Event, Transaction } = this.app.entities;
      
      const event = await Event.selectOne({ 
        user: user.uuid, 
        name: "registration" 
      });
      
      let [ currentYear, currentMonth ] = event.month.split("-").map(val => parseInt(val));
      let [ lastYear, lastMonth ] = getCurrentMonth().split("-").map(val => parseInt(val));

      console.log("BEGIN CREATING PROGRES STATS", currentYear, currentMonth, lastYear, lastMonth);
      const progress = {};
      while (currentYear <= lastYear && currentMonth <= lastMonth) {
        console.log(getMonthLabel, currentYear, currentMonth);
        const month = getMonthLabel(currentYear, currentMonth);
        const income = 
          await this._getCategoryStats(user, { start: month, end: month, sign: "+" }); 
        const expenses = 
          await this._getCategoryStats(user, { start: month, end: month, sign: "-" }); 
        progress[month] = { income, expenses };
        console.log("goyt cats");
        currentMonth += 1;
        if (currentMonth > 12) {
          currentYear += 1;
          currentMonth = 1;
        }

      }

      resolve(progress);

    });

  }
 
  getGraphStats(user, params) {
    
    return new Promise((resolve, reject) => {

      const graphs = params ? params.graphs : null;
      if (!graphs) {
        return reject(new UnprocessableEntity(null, "missing_graphs_param"));
      }

      delete params.graphs;

      const { User, Transaction } = this.app.entities;

      User.selectOne({ uuid: user })
      .then(async (user) => {

        if (!user) {
          return reject(new NotFound(null, "user_not_found"));
        }

        const stats = {};
        
        for (let graph of graphs.split(",")) {
          if (graph === "categories") {
            stats.categories = await this._getCategoryStats(user, params);
          } else if (graph === "forecast") {
            stats.forecast = await this._getForecastStats(user, params);
          } else if (graph === "progress") {
            stats.progress = await this._getProgressStats(user, params);
          }
        }
      
        resolve(stats);
      
      });

    });

  }
  
  getRegistrationStats() {
    
    return new Promise(async (resolve, reject) => {
      
      const { Event, User } = this.app.entities;
      
      try {

        const byMonth = await Event.schema.aggregate(
          "month",
          "COUNT",
          {
            where: { name: "registration" }, 
            plain: false,
            group: [ "month" ], 
            attributes: [ "month" ] 
          }
        );
          
        const months = {};
        for (let row of byMonth) {
          months[row.month] = parseInt(row.COUNT);
        }

        const total = await User.schema.count(
          {
            where: {}
          }
        );

        const byGender = await User.schema.aggregate(
          "gender",
          "COUNT",
          {
            where: {},
            plain: false,
            group: [ "gender" ], 
            attributes: [ "gender" ] 
          }
        );
        
        const genders = {};
        for (let row of byGender) {
          genders[row.gender] = parseInt(row.COUNT);
        }
        
        const byAge = await User.schema.aggregate(
          "age",
          "COUNT",
          {
            where: {},
            plain: false,
            group: [ "age" ], 
            attributes: [ "age" ] 
          }
        );
        
        const ages = {};
        for (let row of byAge) {
          ages[row.age] = parseInt(row.COUNT);
        }

        resolve({
          total,
          months,
          genders,
          ages
        });

      } catch (err) {
        log.debug("REG STATS ERR", err);
        reject(err);
      }

    });

  }

}

export default StatsService;
