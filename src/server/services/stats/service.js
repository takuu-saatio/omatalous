"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/services/stats/service");

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
  
  getGraphStats(user) {
  
    return new Promise((resolve, reject) => {

      const { User, Transaction } = this.app.entities;

      User.selectOne({ uuid: user })
      .then((user) => {

        if (!user) {
          return reject(new NotFound(null, "user_not_found"));
        }
        
        Transaction.schema.aggregate(
          "category",
          "COUNT",
          { plain: false, group: [ "category" ], attributes: [ "category" ] }
        )
        .then((rows) => {
          
          log.debug("AGGR RESULT", rows);
          const categories = {};
          for (let row of rows) {
            categories[row.category] = parseInt(row.COUNT);
          }

          const stats = {
            categories
          };

          resolve(stats);      

        })
        .catch((err) => {
          log.debug("AGGR ERR", err);
        });
         
      })

    });

  }

}

export default StatsService;
