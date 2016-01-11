"use strict";

import Sequelize from "sequelize";
import BaseEntity from "./BaseEntity";

class Transaction extends BaseEntity {

  constructor() {
    
    super();

    this.fields = Object.assign(this.fields, {
      
      user: { type: Sequelize.STRING },
      type: { type: Sequelize.CHAR(1) },
      amount: { type: Sequelize.FLOAT },
      description: { type: Sequelize.STRING },
      category: { type: Sequelize.INTEGER },

    });

    this.hiddenFields = this.hiddenFields.concat([]);

  }

  extend() { 
    super.extend();
  }

}

module.exports = new Transaction();
