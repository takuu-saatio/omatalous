"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/services/finance/service");

import slug from "slug";
import { getCurrentMonth } from "../../../core/utils";
import * as utils from "../../../core/utils";

import { 
  BaseError,
  NotFound, 
  Unauthorized,
  UnprocessableEntity
} from "../../../core/errors"

const DAY_NAMES = [ "Su", "Ma", "Ti", "Ke", "To", "Pe", "La" ];

class FinanceService {
  
  constructor(app) {
    this.app = app;
  }

  _getNow() {
    return process.env.NOW ? new Date(process.env.NOW) : new Date();
  }

  _getNextWeekOffset(baseDate) { 
    return baseDate.getDay() !== 0 ? 8 - baseDate.getDay() : 1; 
  }

  _getPeriod(baseDate, periodType) {
 
    const padded = (val) => {
      const padding = val < 10 ? "0" : "";
      return padding + val;
    };

    const format = (date) => {
      return date.getFullYear() + "-" +
        padded(date.getMonth() + 1) + "-" + 
        padded(date.getDate()); 
    };

    let periodStart = null;

    if (periodType === "M") {
      periodStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);  
    } else if (periodType === "W") {
      const offset = baseDate.getDay() !== 0 ? baseDate.getDay() - 1 : 6; 
      periodStart = new Date(baseDate.getFullYear(), 
                             baseDate.getMonth(), baseDate.getDate() - offset);  
    } else {
      periodStart = new Date(baseDate.getFullYear(), 
                             baseDate.getMonth(), baseDate.getDate());  
    }
  
    return format(periodStart);

  }

  _calcWeeklyRepeatingSum(weekDay, amount, startDay) {
 
    const now = this._getNow();
    
    const firstDay = new Date(now.getFullYear(), now.getMonth(), (startDay || 1));
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    let sum = 0;
    const daysInMonth = lastDay.getDate();
    const dayDiff = weekDay - firstDay.getDay();
    const dayOffset = dayDiff >= 0 ? dayDiff : 7 + dayDiff; 
    let currentDay = dayOffset + (startDay || 1);
    log.debug("WEEKLY START", startDay, currentDay);
    while (currentDay <= daysInMonth) { 
      sum += amount;
      currentDay += 7;
      log.debug(amount, sum, currentDay);
    }
    
    log.debug("WEEKLY RESULT", currentDay, " => SUM: ", sum);
    return sum;
  
  }

  _calcDailyRepeatingSum(amount, startDay) {
    
    const now = this._getNow();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return amount * (lastDay.getDate() - (startDay || 0));
  
  }

  _getFutureTransactions(transactions) {
    
    const now = this._getNow();
    const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    if (tomorrow.getMonth() > now.getMonth()) {
      return [];
    }

    const txMap = {};
    for (let day = tomorrow.getDate(); day <= 31; day++) {
      txMap[day] = [];
    }
 
    for (let tx of transactions) {
        
      if (tx.repeats === "M") {
        
        let repeatValue = tx.repeatValue > lastDay.getDate() ? 
          lastDay.getDate() : tx.repeatValue;

        if (repeatValue >= tomorrow.getDate()) {
          let txJson = Object.assign({}, tx.json());
          const monthDate = new Date(now.getFullYear(), now.getMonth(), repeatValue);
          txJson.dateLabel = DAY_NAMES[monthDate.getDay()]+" "+monthDate.getDate();
          txMap[repeatValue].push(txJson);
        }

      } else if (tx.repeats === "W") {

        const daysInMonth = lastDay.getDate();
        const dayDiff = tx.repeatValue - tomorrow.getDay();
        const dayOffset = dayDiff >= 0 ? dayDiff : 7 + dayDiff; 
        let currentDay = dayOffset + tomorrow.getDate();
        while (currentDay <= daysInMonth) { 
          let txJson = Object.assign({}, tx.json());
          txJson.dateLabel = DAY_NAMES[tx.repeatValue]+" "+currentDay;
          txMap[currentDay].push(txJson);
          currentDay += 7;
        }
        
      } else if (tx.repeats === "D") {
      }
      
    }

    let futureTransactions = [];
    for (let day = lastDay.getDate(); day >= tomorrow.getDate(); day--) {
      if (txMap[day].length > 0) {
        futureTransactions = futureTransactions.concat(txMap[day]);
      }
    }

    return futureTransactions;

  } 

  async _getRepeatingSums(user) {

    const { Transaction, Copy } = this.app.entities;
    
    const sums = {
      current: { "+": 0, "-": 0 },
      planned: { "+": 0, "-": 0 }
    };

    const currentMonth = getCurrentMonth();
    const now = this._getNow();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    const repeatingTxs = await Transaction.selectAll({ 
      user,
      type: "repeating"
    });
    
    sums.transactions = repeatingTxs;
    
    const copyTxs = await Transaction.selectAll({ 
      user,
      type: "copy",
      month: currentMonth,
      createdAt: { $lt: now }
    });
    

    log.debug("COPY TXS", copyTxs.length); 
    for(let tx of copyTxs) {
      log.debug("TX: ", tx.sign, tx.amount, tx.repeats);
      sums.current[tx.sign] += tx.amount;
    }

    log.debug("COPY SUM", sums.current);

    log.debug("REPEATING TXS", repeatingTxs.length); 
    for(let tx of repeatingTxs) {
      
      const period = this._getPeriod(now, tx.repeats);      
      
      log.debug("TX: ", tx.sign, tx.amount, tx.repeats, tx.repeatValue, period, 
                now.getDate());
      
      const copyRecords = await Copy.selectAll({
        transaction: tx.uuid,
        period: period
      });

      const hasCopy = copyRecords.length > 0;
      
      let totalAmount = 0;
      let futureAmount = 0;

      if (tx.repeats === "M") {
        totalAmount = tx.amount;
        if (!hasCopy && tx.repeatValue > now.getDate() && now.getDate() < lastDay) {
          futureAmount = tx.amount; 
        }
      } else if (tx.repeats === "W") {
        totalAmount = this._calcWeeklyRepeatingSum(tx.repeatValue, tx.amount, 1);
        const weekOffset = hasCopy ? this._getNextWeekOffset(now) : 1;
        futureAmount = this._calcWeeklyRepeatingSum(tx.repeatValue, tx.amount, 
                                       now.getDate() + weekOffset);
      } else if (tx.repeats === "D") {
        totalAmount = this._calcDailyRepeatingSum(tx.amount, 0);
        futureAmount = 
          this._calcDailyRepeatingSum(tx.amount, now.getDate());
      }

      log.debug("TOTALS: ", totalAmount, futureAmount);
      sums.planned[tx.sign] += totalAmount;
      sums.current[tx.sign] += futureAmount;

    }
    
    return sums;

  }
  
  getTransaction(user, uuid) {
  
    return new Promise((resolve, reject) => {

      const { Transaction } = this.app.entities;

      Transaction.selectOne({
        uuid: uuid
      })
      .then(transaction => {
        
        if (!transaction) {
          return reject(new NotFound(null, "tx_not_found"));
        }

        if (user !== "admin" && transaction.user !== user) {
          return reject(new Unauthorized());
        }

        resolve(transaction);
      
      })
      .catch(err => reject(err));

    });

  }

  getTransactions(user, params, order) {
    
    return new Promise((resolve, reject) => {

      const { Transaction } = this.app.entities;
      
      params = Object.assign((params || {}), { user });
      log.debug("GET TXS!!!!!", params, order);
      
      if (!order) {
        order = "\"createdAt\" DESC";
      }

      Transaction.selectAll(params, { order })
      .then(transactions => {
        
        for (let transaction of transactions) {

          transaction.extras = {
            dateLabel: DAY_NAMES[transaction.createdAt.getDay()] + " " +
              transaction.createdAt.getDate(),
            createdAt: transaction.createdAt
          };
          
        }

        resolve(transactions)
      
      })
      .catch(err => reject(err));

    });

  }
  
  saveTransaction(user, transaction) {
  
    return new Promise((resolve, reject) => {

      const { Transaction } = this.app.entities;
      
      if (transaction.uuid) {
        
        Transaction.selectOne({ uuid: transaction.uuid })
        .then(existingTransaction => {
          
          delete transaction.id;
          delete transaction.uuid;
          delete transaction.user;
          Object.assign(existingTransaction, transaction);
          
          existingTransaction.save()
          .then(() => resolve({ created: false })) 
          .catch(err => reject(err));

        }) 
        .catch(err => reject(err));
        
      } else {

        transaction.user = user;
        
        if (!transaction.month) {
          const date = new Date();
          const monthPadding = date.getMonth() < 9 ? "0" : "";
          transaction.month = date.getFullYear() + "-" +
            monthPadding + (date.getMonth() + 1);
        }
        
        Transaction.schema.create(transaction)
        .then(transaction => resolve({
          created: true,
          transaction
        }))
        .catch(err => reject(err));
      
      }

    });

  }
  
  deleteTransaction(user, uuid) {
    
    return new Promise((resolve, reject) => {

      const { Transaction } = this.app.entities;
      
      Transaction.selectOne({ uuid: uuid })
      .then(transaction => {
         
        if (!transaction) {
          return reject(new NotFound(null, "tx_not_found"));
        }

        if (user !== "admin" && transaction.user !== user) {
          return reject(new Unauthorized());
        }
        
        /*  
        if (transaction.type === "copy") {
          transaction.amount = 0;
          transaction.save()
          .then(() => resolve())
          .catch(err => reject(err));
          return;
        }
        */

        transaction.destroy({ force: true })
        .then(() => resolve()) 
        .catch(err => reject(err));

      }) 
      .catch(err => reject(err)); 

    });

  }

  getGoals(user) {

    return new Promise(async (resolve, reject) => {

      const { Goal, Transaction } = this.app.entities;
       
      Goal.selectAll({ user })
      .then(async (goals) => {
        
        for(let goal of goals) {
          
          const currentMonth = getCurrentMonth();
          const goalEnd = goal.finite ? goal.end : currentMonth;

          let params = {
            user: user,
            $or: [
              { type: "single" },
              { type: "copy" }
            ],
            month: { 
              $gte: goal.start,
              $lte: goalEnd
            }
          };
          
          try {
            
            const nonRepeating = await Transaction.selectAll(params);
            
            let nonRepeatingTotal = 0;
            let nonRepeatingCurrentMonthTotal = 0;
            
            for (let transaction of nonRepeating) {  
              if (transaction.month !== currentMonth) {
                nonRepeatingTotal += transaction.sign === "+" ? 
                  transaction.amount : -transaction.amount;
              } else {
                nonRepeatingCurrentMonthTotal += transaction.sign === "+" ?
                  transaction.amount : -transaction.amount;
              }
            }
            
            params = {
              user: user,
              repeats: { $ne: null }
            };
            
            const repeatingSums = await this._getRepeatingSums(user);
            const repeatingTotal = repeatingSums.current["+"] - 
              repeatingSums.current["-"];
            
            log.debug("GOAL >>> REPEATING SUMS", repeatingSums);
            const startMonth = goal.start > currentMonth ? goal.start : currentMonth;
            const startYYYY = parseInt(startMonth.substring(0, 4));
            const startMM = parseInt(startMonth.substring(5, 7));
            const endYYYY = parseInt(goalEnd.substring(0, 4));
            const endMM = parseInt(goalEnd.substring(5, 7));

            const remainingYears = endYYYY - startYYYY;
            let remainingMonths = (endMM - startMM + 1) + (remainingYears * 12);
            
            let currentMonthSavingGoal = 0;
            if (goal.finite) {
              if (goal.start <= currentMonth && goal.end >= currentMonth) {
                currentMonthSavingGoal = 
                  ((goal.targetAmount - goal.startAmount) 
                  - nonRepeatingTotal) / remainingMonths;
              }
            }

            const currentMonthAvailable =
              (repeatingTotal + nonRepeatingCurrentMonthTotal);

            goal.extras = {
              totalSaved: goal.startAmount + nonRepeatingTotal,
              currentMonthAvailable,
              currentMonthSavingGoal
            };
          
          } catch(err) { 
            log.debug("SAVINGS PROJ ERROR", err); 
          }

        }
 
        console.log("resolve goals", goals); 
        resolve(goals)
      
      })
      .catch(err => reject(err));

    });

  }

  saveGoal(user, goal) {
  
    return new Promise((resolve, reject) => {

      const { Goal } = this.app.entities;
      
      if (goal.uuid) {
        
        Goal.selectOne({ uuid: goal.uuid })
        .then(existingGoal => {
          
          if (!goal) {
            return reject(new NotFound(null, "goal_not_found"));
          }

          if (user !== "admin" && goal.user !== user) {
            return reject(new Unauthorized());
          }

          delete goal.id;
          delete goal.uuid;
          delete goal.user;
          Object.assign(existingGoal, goal);
          
          existingGoal.save()
          .then(() => resolve({ created: false })) 
          .catch(err => reject(err));

        }) 
        .catch(err => reject(err));
        
      } else {

        goal.user = user;
        Goal.schema.create(goal)
        .then(goal => resolve({
          created: true,
          goal
        }))
        .catch(err => reject(err));
      
      }

    });

  }
  
  deleteGoal(user, uuid) {
    
    return new Promise((resolve, reject) => {

      const { Goal } = this.app.entities;
      
      Goal.selectOne({ uuid: uuid })
      .then(goal => {
         
        if (!goal) {
          return reject(new NotFound(null, "goal_not_found"));
        }

        if (user !== "admin" && goal.user !== user) {
          return reject(new Unauthorized());
        }
        
        goal.destroy({ force: true })
        .then(() => resolve()) 
        .catch(err => reject(err));

      }) 
      .catch(err => reject(err)); 

    });

  }

  getCurrentMonthStats(user) {
    
    return new Promise(async (resolve, reject) => {

      const { Transaction, Copy } = this.app.entities;

      try {
        
        const currentMonth = getCurrentMonth();
 
        const actualTxs = await Transaction.selectAll({  
          user,
          month: currentMonth,
          $or: [
            { type: "single" },
            { type: "copy" }
          ]
        });

        const actual = { "+": 0, "-": 0 };
        const raw = { "+": 0, "-": 0 };
        
        for(let tx of actualTxs) {
          
          if (tx.type !== "copy") {
            actual[tx.sign] += tx.amount;
          }

          raw[tx.sign] += tx.amount;
        
        }
        
        const repeatingSums = await this._getRepeatingSums(user); 
        log.debug("MONTH STATS >>> REPEATING SUMS", repeatingSums);
        
        resolve({ 
          label: currentMonth,
          fixedIncome: repeatingSums.planned["+"],
          fixedExpenses: repeatingSums.planned["-"], 
          actualFixedIncome: repeatingSums.current["+"],
          actualFixedExpenses: repeatingSums.current["-"],
          income: actual["+"],
          expenses: actual["-"], 
          rawIncome: raw["+"], 
          rawExpenses: raw["-"],
          futureTransactions: this._getFutureTransactions(repeatingSums.transactions)
        });

      } catch (err) {
        log.debug("MONTH STATS ERR!!!", err);
        reject(err);
      }

    });

  }
  
  getCategories(user, params) {
  
    return new Promise((resolve, reject) => {

      const { Category } = this.app.entities;
      
      Category.selectAll(params || { user })
      .then(categories => {        
        resolve(categories);
      })
      .catch(err => reject(err));

    });

  }
  
  saveCategory(user, category) {
  
    return new Promise((resolve, reject) => {

      const { Category } = this.app.entities;
      
      if (category.uuid) {
        
        Category.selectOne({ uuid: category.uuid })
        .then(existingCategory => {

          if (!existingCategory) {
            return reject(new NotFound(null, "cat_not_found"));
          }

          if (user !== "admin" && existingCategory.user !== user) {
            return reject(new Unauthorized());
          }

          delete category.id;
          delete category.uuid;
          delete category.user;
          Object.assign(existingCategory, category);
          
          existingCategory.save()
          .then(() => resolve({ created: false })) 
          .catch(err => reject(err));

        }) 
        .catch(err => reject(err));
        
      } else {

        category.user = user;
        if (!category.name) {
          category.name = slug(category.label); 
        }

        Category.schema.create(category)
        .then(category => resolve({
          created: true,
          category
        }))
        .catch(err => reject(err));
      
      }

    });

  }

  deleteCategory(user, uuid) {
    
    return new Promise((resolve, reject) => {

      const { Category, Transaction } = this.app.entities;
      
      Category.selectOne({ uuid: uuid })
      .then(category => {
         
        if (!category) {
          return reject(new NotFound(null, "cat_not_found"));
        }

        if (user !== "admin" && category.user !== user) {
          return reject(new Unauthorized());
        }

        Transaction.schema.update({
          category: "misc"
        },{
          where: { 
            user: category.user,
            category: category.name
          },
          fields: ["category"]
        });

        category.destroy({ force: true })
        .then(() => resolve()) 
        .catch(err => reject(err));

      }) 
      .catch(err => reject(err)); 

    });

  }

}

export default FinanceService;
