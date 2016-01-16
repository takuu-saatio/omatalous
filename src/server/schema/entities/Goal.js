"use strict";

import Sequelize from "sequelize";
import BaseEntity from "./BaseEntity";

class Goal extends BaseEntity {

  constructor() {
    
    super();

    this.fields = Object.assign(this.fields, {
      
      user: { type: Sequelize.STRING },
      amount: { type: Sequelize.FLOAT },
      description: { type: Sequelize.STRING },
      start: { type: Sequelize.STRING },
      end: { type: Sequelize.STRING }
      
    });

    this.hiddenFields = this.hiddenFields.concat([]);

  }

  extend() { 
    super.extend();
  }

}

module.exports = new Goal();
