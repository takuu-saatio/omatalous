"use strict";

import varname from "varname";

class SchemaLoader {
  
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  loadSchema(name) {

    const entity = require(`./entities/${name}`);

    let classMethods = entity.getClassMethods();
    let instanceMethods = entity.getInstanceMethods();
    
    let options = {
      freezeTableName: true,
      classMethods: classMethods,
      instanceMethods: instanceMethods
    };

    const schema = this.sequelize.define(varname.underscore(name), entity.fields, options);
    schema.sync({ force: false }).then((user) => {
      console.log("schema updated:", user);
    });
    
    entity.schema = schema;
    entity.initHooks();

    return entity;

  }

}

export default function(sequelize) {
  return new SchemaLoader(sequelize);
}
