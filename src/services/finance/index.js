"use strict";

import ServiceInterface from "../ServiceInterface";

export class LocalFinanceServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "finance", Object.assign(options, { provideService: true }));
  }
  
  async getTransactions(uuid, params) {
    return await this.service.getTransactions(uuid, params);
  }

  async saveTransaction(user, transaction) {
    return await this.service.saveTransaction(user, transaction);
  }
   
  async deleteTransaction(uuid) {
    return await this.service.deleteTransaction(transaction);
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
