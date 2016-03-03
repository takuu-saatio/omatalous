"use strict";

import ServiceInterface from "../ServiceInterface";

export class LocalUserServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "user", Object.assign(options, { provideService: true }));
  }
  
  async getUsers() {
    return await this.service.getUsers();
  }

  async getUser(uuid) {
    return await this.service.getUser(uuid);
  }
  
  async saveUser(user) {
    return await this.service.saveUser(user);
  }
  
  async deleteUser(uuid) {
    return await this.service.deleteUser(uuid);
  }
  
  async getAlerts(user, params) {
    return await this.service.getAlerts(user, params);
  }
  
  async deleteAlert(user, alert) {
    return await this.service.deleteAlert(user, alert);
  }

}

export class HttpUserServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "user", options);
    this.url = options.url;
  }

}
