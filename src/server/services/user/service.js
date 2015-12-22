"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/services/user/service");

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
        
        delete updatedUser.uuid;
        Object.assign(user, updatedUser);
        user.save()
        .then(() => resolve())
        .catch((err) => reject(err));
  
      })
      .catch((err) => reject(err));

    });

  }

  deleteUser(uuid) {
    
    return new Promise((resolve, reject) => {
      
      const { User } = this.app.entities;
      
      User.findByUuid(uuid)
      .then((user) => resolve(user))
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
