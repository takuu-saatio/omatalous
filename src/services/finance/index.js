"use strict";

import ServiceInterface from "../ServiceInterface";

export class LocalFinanceServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "finance", Object.assign(options, { provideService: true }));
  }
  
  async getTransaction(user, uuid) {
    return await this.service.getTransaction(user, uuid);
  }

  async getTransactions(uuid, params) {
    return await this.service.getTransactions(uuid, params);
  }

  async saveTransaction(user, transaction) {
    return await this.service.saveTransaction(user, transaction);
  }
   
  async deleteTransaction(user, uuid) {
    return await this.service.deleteTransaction(user, uuid);
  }

  async getBudget() {
  }

  async saveBudget() {
  }
  
  async getSaveGoal() {
  }

  async saveSaveGoal() {
  }

}

export class HttpFinanceServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "finance", options);
    this.url = options.url;
  }

}
