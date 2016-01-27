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
  
  _getCategoryStats(user) {
    
    const { Transaction } = this.app.entities;

    return new Promise((resolve, reject) => {
   
      Transaction.schema.aggregate(
        "amount",
        "SUM",
        { 
          where: { 
            user: user.uuid,
            $or: [ 
              { type: "single" },
              { type: "copy" } 
            ]
          },
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
  
  getGraphStats(user) {
    
    return new Promise((resolve, reject) => {
      
      const { User, Transaction } = this.app.entities;

      User.selectOne({ uuid: user })
      .then(async (user) => {

        if (!user) {
          return reject(new NotFound(null, "user_not_found"));
        }
        
        const categories = await this._getCategoryStats(user);
      
        const stats = {
          categories
        };
      
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
