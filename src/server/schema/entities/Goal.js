"use strict";

import Sequelize from "sequelize";
import BaseEntity from "./BaseEntity";

class Goal extends BaseEntity {

  constructor() {
    
    super();

    this.fields = Object.assign(this.fields, {
      
      user: { type: Sequelize.STRING },
      startAmount: { type: Sequelize.FLOAT },
      targetAmount: { type: Sequelize.FLOAT },
      description: { type: Sequelize.STRING },
      start: { type: Sequelize.STRING },
      end: { type: Sequelize.STRING },
      finite: { type: Sequelize.BOOLEAN }

    });

    this.hiddenFields = this.hiddenFields.concat([]);

  }

  extend() { 
    super.extend();
  }

}

module.exports = new Goal();
