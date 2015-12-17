"use strict";

export default class ServiceInterface {

  constructor(app, service, options) {
    if (options) {
      if (options.provideService) {
        const Service = require(`../server/services/${service}/service`);
        this.service = new Service(app);
      }
      if (options.provideRoutes) {
        const { registerRoutes } = require(`../server/services/${service}/api`);
        registerRoutes(app);
      }
    }
  }

}
