"use strict";

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
        
        const pwdMatch = user.password === password;
        if (!pwdMatch) {
          reject(new Unauthorized(null, "pwd_mismatch"));
          return;
        }
        
        user.token = uuid.v4();
        user.save()
        .then(() => resolve({ user }))
        .catch((err) => reject(new BaseErr(err)));

      }).catch((err) => reject(new BaseError(err)));

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
        
        const pwdHash = user.password;
        user.password = pwdHash;
        user.save()
        .then(() => resolve({ user }))
        .catch((err) => reject(new BaseErr(err)));

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
