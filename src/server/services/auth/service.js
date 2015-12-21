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
  
  login(loginParams) {

    return new Promise((resolve, reject) => {
      
      const { User } = this.app.entities;
    
      const { email, password } = loginParams;

      // Find the user based on email
      User.schema.findOne({
        where: { email: email }
      }).then((user) => {

        // If user not found, create a new one
        if (!user) {
          
          const pwdHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
          user = {
            email: email,
            password: pwdHash
          };
        
          User.schema.create(user)
          .then((user) => {
            resolve({ user, newUser: true })
          })
          .catch((err) => {
            reject(new BaseErr(err))
          });

          return;
          
        }
        
        // If user was found, check if the password matches
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
