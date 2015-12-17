"use strict";

import ServiceInterface from "../ServiceInterface"

export class LocalAuthServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "auth", Object.assign(options, { provideService: true }));
  }

  async screenRequest(req) {
    return await this.service.screenRequest(req);
  }
  
  async login(loginParams) {
    return await this.service.login(loginParams);
  }
  
  async register(regParams) {
    return await this.service.register(regParams);
  }

}

export class HttpAuthServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "auth", options);
    this.url = options.url;
  }

  async screenRequest(req) {
    // Perform query to the api endpoint
  }

}

