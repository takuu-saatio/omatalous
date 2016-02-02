"use strict";

import Sequelize from "sequelize";
import BaseEntity from "./BaseEntity";

class Transaction extends BaseEntity {

  constructor() {
    
    super();

    this.fields = Object.assign(this.fields, {
      
      user: { type: Sequelize.STRING },
      sign: { type: Sequelize.CHAR(1) },
      type: { type: Sequelize.STRING },
      amount: { type: Sequelize.FLOAT },
      description: { type: Sequelize.STRING },
      category: { type: Sequelize.STRING },
      repeats: { type: Sequelize.STRING },
      repeatValue: { type: Sequelize.INTEGER },
      month: { type: Sequelize.STRING }

    });

    this.hiddenFields = this.hiddenFields.concat([]);

  }

  extend() { 
    super.extend();
  }

}

module.exports = new Transaction();
