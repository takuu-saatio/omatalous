"use strict";

class AuthServiceInterface {

  constructor(app, options) {
    if (options) {
      if (options.provideService) {
        const AuthService = require("../../server/services/auth/service");
        this.service = new AuthService(app);
        if (options.provideRoutes) {
          const { registerRoutes } = require("../../server/services/auth/api");
          registerRoutes(app);
        }
      }
    }
  }

}

export class LocalAuthServiceInterface extends AuthServiceInterface {

  constructor(app, options) {
    super(app, Object.assign(options, { provideService: true }));
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

export class HttpAuthServiceInterface extends AuthServiceInterface {

  constructor(app, options) {
    super(app, options);
    this.url = options.url;
  }

  async screenRequest(req) {
    // Perform query to the api endpoint
  }

}

