"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/services/auth/service");

import bcrypt from "bcrypt-nodejs";
import uuid from "node-uuid"
import { 
  NotFound, 
  Unauthorized,
  UnprocessableEntity
} from "../../../core/errors"

class AuthService {

  constructor(app) {
    this.app = app;
  }

  _loginWithPassword(loginParams) {

    return new Promise((resolve, reject) => {
      
      const { User } = this.app.entities;
    
      const { email, password } = loginParams;
      User.schema.findOne({
        where: { email: email }
      }).then((user) => {

        if (!user) {
          reject(new NotFound(null, "user_not_found"));
          return;
        }

        try { 
          
          const pwdMatch = bcrypt.compareSync(password, user.password);
          if (!pwdMatch) {
            reject(new Unauthorized(null, "pwd_mismatch"));
            return;
          }

          resolve({ user });
        
        } catch (err) { 
          reject(new Unauthorized(err, "hash_error"));
        }

      });

    });

  }

  login(loginParams) {
      
    switch (loginParams.method) {

      case "password":
        return this._loginWithPassword(loginParams);
      case "facebook":
      case "google":
      default:
        return new Promise((resolve, reject) => {
          reject(new UnprocessableEntity(null, "unsupported_method"));
        });

    }

  }

  _registerWithPassword(regParams) {

    return new Promise((resolve, reject) => {
      
      const { User } = this.app.entities;
        
      const { email, password } = regParams;
      
      User.schema.findOne({
        where: { email: email }
      }).then((user) => {

        if (user) {
          reject(new UnprocessableEntity(null, "user_exists"));
          return;
        }
         
        const pwdHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        user = {
          email: email,
          password: pwdHash
        };
        
        User.schema.create(user)
        .then((user) => {
          resolve({ user })
        })
        .catch((err) => {
          reject(new BaseErr(err))
        });

      }).catch((err) => reject(new BaseError(err)));
    
    });

  }

  register(regParams) {

    switch (regParams.method) {

      case "password":
        return this._registerWithPassword(regParams);
      case "facebook":
      case "google":
      default:
        return new Promise((resolve, reject) => {
          reject(new UnprocessableEntity(null, "unsupported_method"));
        });
    }

  }

  screenRequest(req) {
    
    return new Promise((resolve, reject) => {
    
      let token = req.params.token || req.headers["x-omatalous-id"];

      if (!token) {
        reject(new UnprocessableEntity(null, "no_token"));
      }
    
      const { User } = this.app.entities;
      User.schema.findOne({
        where: { token: token }
      }).then((user) => {
        if (!user) {
          reject(new NotFound(null, "user_not_found"));
        } else {
          resolve({ user: user });
        }
      }).catch((err) => reject(new BaseError(err)));

    });

  }

}

export default AuthService;
