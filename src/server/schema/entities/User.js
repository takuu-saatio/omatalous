"use strict";

import Sequelize from "sequelize";
import BaseEntity from "./BaseEntity";

class User extends BaseEntity {

  constructor() {
    
    super();

    this.fields = Object.assign(this.fields, {

      email: { type: Sequelize.STRING },
      username: { type: Sequelize.STRING },
      password: { type: Sequelize.STRING },
      extId: { type: Sequelize.STRING },
      token: { type: Sequelize.STRING },
      age: { type: Sequelize.STRING },
      gender: { type: Sequelize.CHAR(1) },
      icon: { type: Sequelize.STRING },
      firstName: {
        type: Sequelize.STRING,
        field: "first_name"
      },
      lastName: {
        type: Sequelize.STRING,
        field: "last_name"
      }

    });

    this.hiddenFields = this.hiddenFields.concat(["token", "password"]);

  }

  extend() { 
    super.extend();
  }

}

module.exports = new User();
