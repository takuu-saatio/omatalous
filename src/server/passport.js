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
  
  const loginWithProfile = (provider, profile, done) => {
    
    var email = (profile && profile.emails && profile.emails.length > 0) ? 
      profile.emails[0].value : null;

    if (!email) {
      return done(new Unauthorized(null, "missing_provider_data"));
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
          user.isNew = true;
          log.debug(`Registered user by ${provider}`, user);
          done(null, user);
        })
        .catch((err) => {
          done(err);
        });

        return;
      
      }

      user = user.json();
      log.debug(`Logged in user by ${provider}`, user);
      done(null, user);

    })
    .catch((err) => {
      done(err);
    });

  }

  const LocalStrategy = require("passport-local").Strategy;
  const FacebookStrategy = require("passport-facebook").Strategy;
  const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
  
  app.passport.use("login-facebook", new FacebookStrategy({
    clientID: "1053035831402707",
    clientSecret: "e58adca988aee4b0a7dafd24de4d55d8",
    callbackURL: "http://localhost:5000/login/fb/callback",
    profileFields: ["id", "emails", "name" ],
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {

      log.debug("Invoke Facebook login strategy", accessToken, refreshToken, profile);
      loginWithProfile("Facebook", profile, done);

    }
  
  ));

  app.passport.use("login-google", new GoogleStrategy({
    clientID: "129466263199-h5gbqbl58ejjteeit62an452n1aitv41.apps.googleusercontent.com",
    clientSecret: "jPchRiQMPl9_-quc1xF4BQtc",
    callbackURL: "http://localhost:5000/login/google/callback",
    profileFields: ["id", "emails", "name" ],
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
      
      log.debug("Invoke Google login strategy", accessToken, refreshToken, profile);
      loginWithProfile("Google", profile, done);

    }
                                                       
 ));

}
