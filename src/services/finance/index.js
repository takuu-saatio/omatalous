"use strict";

import ServiceInterface from "../ServiceInterface";

export class LocalFinanceServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "finance", Object.assign(options, { provideService: true }));
  }
  
  async getTransaction(user, uuid) {
    return await this.service.getTransaction(user, uuid);
  }

  async getTransactions(user, params, order) {
    return await this.service.getTransactions(user, params, order);
  }

  async saveTransaction(user, transaction) {
    return await this.service.saveTransaction(user, transaction);
  }
   
  async deleteTransaction(user, uuid) {
    return await this.service.deleteTransaction(user, uuid);
  }
  
  async getGoals(uuid) {
    return await this.service.getGoals(uuid);
  }

  async saveGoal(user, goal) {
    return await this.service.saveGoal(user, goal);
  }
   
  async deleteGoal(user, uuid) {
    return await this.service.deleteGoal(user, uuid);
  }

  async getCurrentMonthStats(user) {
    return await this.service.getCurrentMonthStats(user);
  }
  
  async getCategories(user, params) {
    return await this.service.getCategories(user, params);
  }
  
  async saveCategory(user, category) {
    return await this.service.saveCategory(user, category);
  }
   
  async deleteCategory(user, uuid) {
    return await this.service.deleteCategory(user, uuid);
  }


}

export class HttpFinanceServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "finance", options);
    this.url = options.url;
  }

}
