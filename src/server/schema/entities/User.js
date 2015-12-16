"use strict";

import Sequelize from "sequelize";
import BaseEntity from "./BaseEntity";

class User extends BaseEntity {

  constructor() {
    
    super();

    this.fields = {

      uuid: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      username: { type: Sequelize.STRING },
      password: { type: Sequelize.STRING },
      token: { type: Sequelize.STRING },
      firstName: {
        type: Sequelize.STRING,
        field: "first_name"
      },
      lastName: {
        type: Sequelize.STRING,
        field: "last_name"
      }

    };

  }

  extend() { 
    super.extend();
  }

}

module.exports = new User();
