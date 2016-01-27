"use strict";

import Sequelize from "sequelize";
import BaseEntity from "./BaseEntity";

class Event extends BaseEntity {

  constructor() {
    
    super();

    this.fields = Object.assign(this.fields, {

      user: { type: Sequelize.STRING },
      name: { type: Sequelize.STRING },
      value: { type: Sequelize.STRING },
      month: { type: Sequelize.STRING },
      day: { type: Sequelize.STRING }

    });

    this.hiddenFields = this.hiddenFields.concat([]);

  }

  extend() { 
    super.extend();
  }

}

module.exports = new Event();
