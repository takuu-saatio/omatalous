"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/passport");

import generatePassword from "password-generator";
import bcrypt from "bcrypt-nodejs";

import { BaseError, Unauthorized } from "../core/errors";

export default function(app) {
   
  const { User } = app.entities;
  
  app.passport.serializeUser((user, done) => { 
    done(null, user.uuid); 
  });
  
  app.passport.deserializeUser((uuid, done) => { 
    User.schema.findByUuid(uuid)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err)); 
  });

  const LocalStrategy = require("passport-local").Strategy;
  const FacebookStrategy = require("passport-facebook").Strategy;
  
  const { auth } = app.services;

  app.passport.use("login-local", new LocalStrategy(
    
    async (username, password, done) => {

      log.debug("Invoke local login strategy", username);

      try {
        
        const result = await auth.login({
          method: "password",
          email: username,
          password: password
        });

        let user = result.user.json();  
        log.debug("Logged in user", user);
        done(null, user);
      
      } catch (err) {
        return done(err);
      }

    }
  
  ));

  app.passport.use("login-facebook", new FacebookStrategy({
    clientID: "1053035831402707",
    clientSecret: "e58adca988aee4b0a7dafd24de4d55d8",
    callbackURL: "http://localhost:5000/api/login/fb/callback",
    profileFields: ["id", "emails", "name" ]
  }, async (accessToken, refreshToken, profile, done) => {

      log.debug("Invoke Facebook login strategy", accessToken, refreshToken, profile);

      var email = (profile && profile.emails && profile.emails.length > 0) ? 
        profile.emails[0].value : null;

      if (!email) {
        return next(new Unauthorized(null, "missing_fb_data"));
      }
       
      User.schema.findOne({
        where: { email: email }
      })
      .then((user) => {
        
        if (!user) {
          
          const password = generatePassword(8, false);
          const pwdHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
          user = Object.assign({ 
            email: email, 
            password: pwdHash 
          }, profile.name ? {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName
          } : {});

          User.schema.create(user)
          .then((user) => {
            user = user.json();
            log.debug("Registered user by Facebook", user);
            done(null, user);
          })
          .catch((err) => {
            done(err);
          });

          return;
        
        }

        user = user.json();
        log.debug("Logged in user by Facebook", user);
        done(null, user);

      })
      .catch((err) => {
        done(err);
      });

    }
  
  ));

  app.passport.use("register-local", new LocalStrategy(
    
    async (username, password, done) => {

      log.debug("Invoke local reg strategy", username);
      
      try {
        
        const result = await auth.register({
          method: "password",
          email: username,
          password: password
        });
        
        let user = result.user.json();  
        log.debug("Registered user", user);
        done(null, user);

      } catch (err) {
        return done(err);
      }

    }
  
  ));
}
