"use strict";

import uuid from "node-uuid";

class BaseEntity {
  
  constructor() {
    this.classMethods = {};
    this.instanceMethods = {};
  }

  initHooks() {

    this.schema.beforeCreate((schema, options) => {
      if (this.fields.uuid) {
        schema.uuid = uuid.v4();
      }
    });

  }

  getClassMethods() {
    return Object.assign(this.classMethods, {
      findByUuid: (uuid) => {
        return this.schema.findOne({ 
          where: { uuid: uuid }
        });
      }
    });
  }

  getInstanceMethods() {
    return Object.assign(this.instanceMethods, {
      json: function () {
        let json = this.toJSON();
        delete json.id;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
      }
    });
  }

}

export default BaseEntity
