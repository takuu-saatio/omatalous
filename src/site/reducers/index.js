import { combineReducers } from "redux";
import { routeReducer } from "redux-simple-router";
import test from "./test";
import auth from "./auth";
import home from "./home";
import login from "./login";
import recovery from "./recovery";
import account from "./account";
import MainTabsReducer from "./MainTabsReducer";
import ConsumptionReducer from "./ConsumptionReducer";
import TransactionReducer from "./TransactionReducer";
import GoalsReducer from "./GoalsReducer";
import BudgetsReducer from "./BudgetsReducer";
import content from "./content";
import admin from "./admin";

export default function(reducers) {
   
  return combineReducers({
    routing: routeReducer,
    test,
    auth,
    home,
    login,
    recovery,
    account,
    mainTabs: MainTabsReducer,
    consumption: ConsumptionReducer,
    transaction: TransactionReducer,
    budgets: BudgetsReducer,
    goals: GoalsReducer,
    content,
    admin
  });

}
