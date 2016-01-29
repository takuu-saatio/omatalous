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

const DAY_NAMES = [ "Ma", "Ti", "Ke", "To", "Pe", "La", "Su" ];

class FinanceService {
  
  constructor(app) {
    this.app = app;
    const { SENDGRID_USER, SENDGRID_PASSWORD } = process.env;
    this.sendgrid = require("sendgrid")(SENDGRID_USER, SENDGRID_PASSWORD);
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
            createdAt: DAY_NAMES[transaction.createdAt.getDay()] + " " +
              transaction.createdAt.getDate()
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
          
          if (goal.start && goal.end) {
              
            const currentMonth = getCurrentMonth();

            let params = {
              user: user,
              $or: [
                { type: "single" },
                { type: "copy" }
              ],
              month: { 
                $gte: goal.start,
                $lte: goal.end
              }
            };
            
            try {
              
              const nonRepeating = await Transaction.selectAll(params);
              
              let nonRepeatingTotal = 0;
              let nonRepeatingCurrentMonthTotal = 0;
              
              nonRepeating.forEach(transaction => {  
                if (transaction.month !== currentMonth) {
                  nonRepeatingTotal += transaction.sign === "+" ? 
                    transaction.amount : -transaction.amount;
                } else {
                  nonRepeatingCurrentMonthTotal += transaction.sign === "+" ?
                    transaction.amount : -transaction.amount;
                }
              });
              
              params = {
                user: user,
                repeats: { $ne: null }
              };

              const repeating = await Transaction.selectAll(params);
              let repeatingTotal = 0;
              repeating.forEach(transaction => { 
                repeatingTotal += transaction.sign === "+" ?
                  transaction.amount : -transaction.amount;
              });

              const startMonth = goal.start > currentMonth ? goal.start : currentMonth;
              const startYYYY = parseInt(startMonth.substring(0, 4));
              const startMM = parseInt(startMonth.substring(5, 7));
              const endYYYY = parseInt(goal.end.substring(0, 4));
              const endMM = parseInt(goal.end.substring(5, 7));

              const remainingYears = endYYYY - startYYYY;
              let remainingMonths = (endMM - startMM) + (remainingYears * 12);
              
              const currentMonthSavingGoal =
                (goal.amount - nonRepeatingTotal) / remainingMonths;

              const currentMonthAvailable =
                (repeatingTotal + nonRepeatingCurrentMonthTotal);

              goal.extras = {
                totalSaved: nonRepeatingTotal,
                currentMonthAvailable,
                currentMonthSavingGoal
              };
            
            } catch(err) { 
              log.debug("SAVINGS PROJ ERROR", err); 
            }

          }

        }
        
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

      const { Transaction } = this.app.entities;
      const currentMonth = getCurrentMonth();

      Transaction.selectAll({ user, month: currentMonth })
      .then((transactions) => {

        let fixedIncome = 0;
        let fixedExpenses = 0;
        let income = 0;
        let expenses = 0;
        let rawIncome = 0;
        let rawExpenses = 0;

        for(let transaction of transactions) {

          if (transaction.sign === "+") {
            
            if (transaction.repeats) {
              fixedIncome += transaction.amount;
            } else {
              if (transaction.type !== "copy") {
                income += transaction.amount;
              }
              rawIncome += transaction.amount;
            }

          } else {
            
            if (transaction.repeats) {
              fixedExpenses += transaction.amount;
            } else {
              if (transaction.type != "copy") {
                expenses += transaction.amount;
              }
              rawExpenses += transaction.amount;
            }
          }

        }

        resolve({ 
          label: currentMonth,
          fixedIncome, fixedExpenses, income, expenses, rawIncome, rawExpenses 
        });

      })
      .catch(err => reject(err));

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
