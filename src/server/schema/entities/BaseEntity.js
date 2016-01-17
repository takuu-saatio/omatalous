"use strict";

import Sequelize from "sequelize";
import uuid from "node-uuid";

class BaseEntity {
  
  constructor() {
    this.classMethods = {};
    this.instanceMethods = {};
    this.fields = {
      uuid: { type: Sequelize.STRING, unique: true },
      deleted: { type: Sequelize.BOOLEAN }
    };
    this.hiddenFields = ["id", "deleted", "createdAt", "updatedAt"];
  }

  initHooks() {

    this.schema.beforeCreate((schema, options) => {
      schema.uuid = uuid.v4();
      schema.deleted = false;
    });

  }
  
  selectOne(query) {
    query.deleted = false;
    return this.schema.findOne({
      where: query
    });
  }
  
  selectAll(query, params) {
    query.deleted = false;
    return this.schema.findAll(Object.assign({
      where: query
    }, params || {}));
  }
  
  findByUuid(uuid) {
    return this.selectOne({ uuid });
  }

  getClassMethods() {
    return Object.assign(this.classMethods, {});
  }

  getInstanceMethods() {
    const hiddenFields = this.hiddenFields;
    return {
      json: function () {
        let json = this.toJSON();
        hiddenFields.forEach(field => {
          delete json[field]
        });
        return Object.assign(json, this.extras || {});
      }
    };
  }

}

export default BaseEntity
