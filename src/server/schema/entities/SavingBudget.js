"use strict";

import Sequelize from "sequelize";
import BaseEntity from "./BaseEntity";

class SavingBudget extends BaseEntity {

  constructor() {
    
    super();

    this.fields = Object.assign(this.fields, {
      
      user: { type: Sequelize.STRING },
      total: { type: Sequelize.FLOAT },
      starts: { type: Sequelize.INTEGER },
      ends: { type: Sequelize.INTEGER },
      repeats: { type: Sequelize.BOOLEAN },
      description: { type: Sequelize.STRING }

    });

    this.hiddenFields = this.hiddenFields.concat([]);

  }

  extend() { 
    super.extend();
  }

}

module.exports = new SavingBudget();
