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
import TransactionsView from "./components/TransactionsView";
import * as TransactionsActions from "./actions/transactions";
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
export const TransactionsContainer = container(TransactionsView, TransactionsActions, "transactions");
export const ContentContainer = container(ContentView, {}, "content");
export const AdminContainer = container(AdminView, AdminActions, "admin");
