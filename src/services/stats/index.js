"use strict";

import ServiceInterface from "../ServiceInterface"

export class LocalStatsServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "stats", Object.assign(options, { provideService: true }));
  }

  async getGraphStats(user, params) {
    return await this.service.getGraphStats(user, params);
  }
  
  async getRegistrationStats() {
    return await this.service.getRegistrationStats();
  }

}

export class HttpStatsServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "stats", options);
    this.url = options.url;
  }

}

