"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/services/finance/service");

import { 
  BaseError,
  NotFound, 
  Unauthorized,
  UnprocessableEntity
} from "../../../core/errors"

class FinanceService {
  
  constructor(app) {
    this.app = app;
    const { SENDGRID_USER, SENDGRID_PASSWORD } = process.env;
    this.sendgrid = require("sendgrid")(SENDGRID_USER, SENDGRID_PASSWORD);
  }
  
  getTransactions(user, params) {
  
    return new Promise((resolve, reject) => {

      const { Transaction } = this.app.entities;

      Transaction.selectAll({
        user: user
      })
      .then(transactions => resolve(transactions))
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
        Transaction.schema.create(transaction)
        .then(transaction => resolve({
          created: true,
          transaction
        }))
        .catch(err => reject(err));
      
      }

    });

  }

}

export default FinanceService;

