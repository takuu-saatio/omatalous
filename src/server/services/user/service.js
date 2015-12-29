"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/services/user/service");

import bcrypt from "bcrypt-nodejs";
import { Forbidden } from "../../../core/errors";

class UserService {

  constructor(app) {
    this.app = app;
  }

  getUser(uuid) {
   
    return new Promise((resolve, reject) => {
      
      const { User } = this.app.entities;
      User.findByUuid(uuid)
      .then((user) => resolve(user))
      .catch((err) => reject(err));  

    });

  }
  
  saveUser(updatedUser) {

    return new Promise((resolve, reject) => {
      
      const { User } = this.app.entities;
      
      User.findByUuid(updatedUser.uuid)
      .then((user) => {
      
        if (!user) {
          reject(new NotFound(null, "user_not_found"));
          return;
        }

        User.selectOne({ email: updatedUser.email })
        .then((dupeUser) => {
          
          if (dupeUser && dupeUser.uuid !== updatedUser.uuid) {
            reject(new Forbidden(null, "another_user_exists"));
            return;
          }
                    
          delete updatedUser.uuid;
          const password = updatedUser.password;
          if (password && password.length > 0) {
            const pwdHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
            updatedUser.password = pwdHash;
          } else {
            delete updatedUser.password;
          }
          
          Object.assign(user, updatedUser);
          user.save()
          .then(() => {
            resolve({ pwdChanged: (password && password.length > 0) })
          })
          .catch((err) => reject(err));

        })
        .catch((err) => reject(err));
 
      })
      .catch((err) => reject(err));

    });

  }

  deleteUser(uuid) {
    
    return new Promise((resolve, reject) => {
      
      const { User } = this.app.entities;
      
      User.findByUuid(uuid)
      .then((user) => {

        if (!user) {
          reject(new NotFound(null, "user_not_found"));
          return;
        }
        
        user.deleted = true; 
        user.save()
        .then(() => resolve())
        .catch((err) => reject(err));
      
      })
      .catch((err) => reject(err));  

    });

  }

  getUsers() {

    return new Promise((resolve, reject) => {
  
      const { User } = this.app.entities;
      
      User.selectAll({})
      .then((users) => resolve(users))
      .catch((err) => reject(err));

    });

  }

}

export default UserService;
