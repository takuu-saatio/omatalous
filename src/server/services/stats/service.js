"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/services/stats/service");

import { getCurrentMonth } from "../../../core/utils";

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
         
        const actual = await Transaction.selectAll(where, order)
        const actualVals = [];
        let balance = 0;
        for (let tx of actual) {
          const amount = tx.sign === "+" ? tx.amount : -tx.amount;
          balance += amount;
          actualVals.push({ x: tx.createdAt, y: balance });
        }
        
        delete where.month;
        delete where.$or;
        where.type = "repeating";
         
        const repeating = await Transaction.selectAll(where)
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const repeatingMap = {
          M: [], W: [], D: []
        };
        
        for (let tx of repeating) {
          repeatingMap[tx.repeats].push(tx);
        }
        
        const repeatingValsMap = {};
        let dailySum = 0;
        for (let day = 1; day <= lastDay.getDate(); day++) {
          repeatingValsMap[day] = [];
          if (repeatingMap.D.length > 0) {
            dailySum = 0; 
            for (let tx of repeatingMap.D) {
              const amount = tx.sign === "+" ? tx.amount : -tx.amount;
              dailySum += amount;
            }
            repeatingValsMap[day].push(dailySum);
          }
        }
 
        if (repeatingMap.M.length > 0) {
          for (let tx of repeatingMap.M) {
            const amount = tx.sign === "+" ? tx.amount : -tx.amount;
            repeatingValsMap[tx.repeatValue].push(amount);
          }
        }

        if (repeatingMap.W.length > 0) {
          for (let tx of repeatingMap.W) {
            
            const amount = tx.sign === "+" ? tx.amount : -tx.amount;
            const daysInMonth = lastDay.getDate();
            const dayDiff = tx.repeatValue - firstDay.getDay();
            const dayOffset = dayDiff >= 0 ? dayDiff : 7 + dayDiff; 
            const dayOccurences = Math.floor((daysInMonth - dayOffset) / 7);
            let currentDay = dayOffset + 1;
            while (currentDay <= daysInMonth) { 
              repeatingValsMap[currentDay].push(amount);
              currentDay += 7;
            }

          }
        }
        
        const repeatingVals = []; 
        balance = 0;
        for (let day = 1; day <= lastDay.getDate(); day++) {

          let dailySum = 0;
          for (let val of repeatingValsMap[day]) { 
            dailySum += val;
          }
          
          if (dailySum !== 0) {
            balance += dailySum;
            repeatingVals.push({
              x: new Date(now.getFullYear(), now.getMonth(), day + 1),
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

  _getTimeStats(user) {
    
    const { Transaction } = this.app.entities;

    return new Promise((resolve, reject) => {
   
      Transaction.schema.aggregate(
        "category",
        "COUNT",
        { 
          where: { user: user.uuid },
          plain: false, 
          group: [ "category" ], 
          attributes: [ "category" ] 
        }
      )
      .then((rows) => {
        
        log.debug("AGGR RESULT", rows);
        const categories = {};
        for (let row of rows) {
          categories[row.category] = parseInt(row.COUNT);
        }

        resolve(categories);      

      })
      .catch((err) => {
        log.debug("AGGR ERR", err);
        reject(err);
      });
       
    })

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
          }
        }
      
        resolve(stats);
      
      });

    });

  }
  
  getRegistrationStats() {
    
    return new Promise((resolve, reject) => {
      
      const { Event } = this.app.entities;

      Event.schema.aggregate(
        "month",
        "COUNT",
        {
          where: { name: "registration" }, 
          plain: false,
          group: [ "month" ], 
          attributes: [ "month" ] 
        }
      )
      .then((rows) => {
        
        log.debug("AGGR RESULT", rows);
        const registrations = {};
        for (let row of rows) {
          registrations[row.month] = parseInt(row.COUNT);
        }

        resolve(registrations);      

      })
      .catch((err) => {
        log.debug("AGGR ERR", err);
        reject(err);
      });

    });

  }

}

export default StatsService;
