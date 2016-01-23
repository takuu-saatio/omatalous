"use strict";

import Sequelize from "sequelize";
import BaseEntity from "./BaseEntity";

class Alert extends BaseEntity {

  constructor() {
    
    super();

    this.fields = Object.assign(this.fields, {
      
      user: { type: Sequelize.STRING },
      type: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      behavior: { type: Sequelize.STRING },
      message: { type: Sequelize.STRING },
      dismissedAt: { type: Sequelize.DATE }

    });

    this.hiddenFields = this.hiddenFields.concat([]);

  }

  extend() { 
    super.extend();
  }

}

module.exports = new Alert();

