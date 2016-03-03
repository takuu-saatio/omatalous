"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/services/auth/service");

import bcrypt from "bcrypt-nodejs";
import generatePassword from "password-generator";
import uuid from "node-uuid";
import { isAdmin, getCurrentMonth } from "../../../core/utils";
import { 
  BaseError,
  NotFound, 
  Unauthorized,
  UnprocessableEntity
} from "../../../core/errors";

class AuthService {
  
  constructor(app) {
    this.app = app;
    const { SENDGRID_API_KEY } = process.env;
    this.sendgrid = require("sendgrid")(SENDGRID_API_KEY);
  }
  
  sendRecoveryLink(recoveryParams) {
  
    return new Promise((resolve, reject) => {

      const { User } = this.app.entities;
      const { email } = recoveryParams;

      User.selectOne({ email: email })
      .then((user) => {

        if (!user) {
          return reject(new NotFound(null, "user_not_found"));
        }
      
        user.token = generatePassword(12, false);
        user.save()
        .then(() => {
          
          let hostName = process.env.APP_HOSTNAME || "localhost:5000"; 
          this.sendgrid.send({
            to: user.email,
            from: "noreply@takuu-saatio.fi",
            subject: "[Takuu-Säätiö] Kirjautusmislinnki",
            html: 
              `<div>
                 <div>Kertakäyttöinen kirjautumislinkkisi</div>
                 <div>
                  <a href="http://${hostName}/login/${user.token}">
                    http://${hostName}/login/${user.token}
                  </a>
                 </div>
               </div>`
          }, (err, json) => {
            log.debug("Recovery link send result", err, json);
            if (err) {
              return reject(err);
            }
            resolve();
          });
        })
        .catch((err) => {
          reject(new BaseError(err));
        })

      })

    });

  }

  login(loginParams) {

    return new Promise((resolve, reject) => {
      
      const { User, Goal, Alert, Event, Category } = this.app.entities;
    
      let { 
        method, email, password, firstName, lastName,
        extId, gender, username, icon 
      } = loginParams;
      
      const searchCriteria = email === "token" ?
        { token: password } : { email: email };
      
      // Find the user based on email or recovery token
      User.selectOne(searchCriteria)
      .then((user) => {
        
        // If user not found, create a new one
        if (!user) {

          // ...unless authentication by token
          if (email === "token") {
            reject(new NotFound(null, "token_not_found"));
            return;
          }

          password = password || generatePassword(8, false);
          const pwdHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
          user = {
            email, password, firstName, lastName,
            extId, username, gender, icon,
            password: pwdHash
          };
        
          User.schema.create(user)
          .then((user) => {
            
            log.debug(`Created new user with ${method} method`, user);

            let alert = {
              user: user.uuid,
              status: "active",
              type: "welcome",
              behavior: "delete_on_dismiss",
              message: "Tervetuloa",
              month: getCurrentMonth()
            };
            
            Alert.schema.create(alert)
            .then((alert) => {
              log.debug("Welcome alert created");
            })
            .catch((err) => {
              log.debug("Error creating welcome alert");
            });

            const now = new Date();
            const currentDay = now.getDate() < 10 ? 
              `0${now.getDate()}` : `${now.getDate()}`;

            const event = {
              user: user.uuid,
              name: "registration",
              month: getCurrentMonth(),
              day: currentDay
            };
            
            Event.schema.create(event)
            .then((event) => {
              log.debug("Reg event created");
            })
            .catch((err) => {
              log.debug("Error creating reg event");
            });
            
            const goal = {
              user: user.uuid,
              startAmount: 0,
              start: getCurrentMonth(),
              finite: false
            };
            
            Goal.schema.create(goal)
            .then((goal) => {
              log.debug("Def goal created");
            })
            .catch((err) => {
              log.debug("Error creating def goal");
            });

            //Category.schema.create({ user: user.uuid, name: "own1", label: "Oma 1" });
            //Category.schema.create({ user: user.uuid, name: "own2", label: "Oma 2" });
            //Category.schema.create({ user: user.uuid, name: "own3", label: "Oma 3" });
            
            resolve({ user: Object.assign(user, { isNew: true }) });
          
          })
          .catch((err) => {
            reject(new BaseError(err))
          });
        
          return;
          
        }
        
        // If token auth, reset the token and resolve
        if (email === "token") {
          user.token = null;
          user.save()
          .then(() => resolve({ user }))
          .catch((err) => reject(err));
          return;
        }

        // If user was found but method does not involve password 
        if (method !== "password") {
          log.debug(`Logged in existing user with ${method} method`, user);
          resolve({ user });
          return;
        }
        
        // If user was found and method invloves password, 
        // check if the password matches
        try { 
          
          console.log(password, user.password); 
          const pwdMatch = bcrypt.compareSync(password, user.password);
          if (!pwdMatch) {
            reject(new Unauthorized(null, "pwd_mismatch"));
            return;
          }

          log.debug(`Logged in existing user with ${method} method`, user);
          
          /*
          Alert.selectOne({ user, type: "welcome" })
          .then(alert => {
            if (alert) {
              alert.destroy({ force: true });
            }
          });
          */

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
