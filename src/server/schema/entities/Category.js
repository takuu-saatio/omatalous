"use strict";

import Sequelize from "sequelize";
import BaseEntity from "./BaseEntity";

class Category extends BaseEntity {

  constructor() {
    
    super();

    this.fields = Object.assign(this.fields, {
      user: { type: Sequelize.STRING },
      name: { type: Sequelize.STRING },
      label: { type: Sequelize.STRING },
      type: { type: Sequelize.STRING }
    });

    this.hiddenFields = this.hiddenFields.concat([]);

  }

  extend() { 
    super.extend();
  }

}

module.exports = new Category();
