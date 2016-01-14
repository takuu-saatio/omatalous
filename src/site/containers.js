"use strict";

import container from "./container";

import HomeView from "./components/HomeView";
import * as HomeActions from "./actions/home";

import LoginView from "./components/LoginView";
import * as LoginActions from "./actions/login";
import LoginRecoveryView from "./components/LoginRecoveryView";
import * as LoginRecoveryActions from "./actions/recovery";
import AccountView from "./components/AccountView";
import * as AccountActions from "./actions/account";
import MainTabsView from "./components/MainTabsView";
import * as MainTabsActions from "./actions/MainTabsActions";
import ConsumptionView from "./components/ConsumptionView";
import * as ConsumptionActions from "./actions/ConsumptionActions";
import EditTransactionView from "./components/EditTransactionView";
import * as EditTransactionActions from "./actions/TransactionActions";
import AdminView from "./components/AdminView";
import * as AdminActions from "./actions/admin";

import * as AuthActions from "./actions/auth";

import TestView from "./components/Test/Test";
import * as TestActions from "./actions/test";

import ContentView from "./components/ContentPage";

export const TestContainer = container(TestView, TestActions, "test");
export const HomeContainer = container(HomeView, HomeActions, "home");
export const LoginContainer = container(LoginView, AuthActions, "login");
export const LoginRecoveryContainer = container(LoginRecoveryView, LoginRecoveryActions, "recovery");
export const AccountContainer = container(AccountView, AccountActions, "account");
export const MainTabsContainer = container(MainTabsView, MainTabsActions, "mainTabs");
export const ConsumptionContainer = container(ConsumptionView, ConsumptionActions, "consumption");
export const EditTransactionContainer = container(EditTransactionView, EditTransactionActions, "transaction");
export const ContentContainer = container(ContentView, {}, "content");
export const AdminContainer = container(AdminView, AdminActions, "admin");
