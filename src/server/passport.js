"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/passport");

import generatePassword from "password-generator";
import bcrypt from "bcrypt-nodejs";

import { BaseError, Unauthorized } from "../core/errors";

export default function(app) {
   
  const { User } = app.entities; 
  const { auth } = app.services;

  const LocalStrategy = require("passport-local").Strategy;
  const FacebookStrategy = require("passport-facebook").Strategy;
  const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
  
  const callbackHost = process.env.APP_HOSTNAME || "localhost";

  const loginWithProfile = async (method, profile) => {
    
    var email = (profile && profile.emails && profile.emails.length > 0) ? 
      profile.emails[0].value : null;

    if (!email) {
      return { error: new Unauthorized(null, "missing_provider_data") };
    }

    try {
      const result = await auth.login({ method, email });
      return result;
    } catch (err) {
      return { error: err };
    }

  }

  app.passport.serializeUser((user, done) => { 
    done(null, user.uuid); 
  });
  
  app.passport.deserializeUser((uuid, done) => { 
    User.findByUuid(uuid)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err)); 
  });
  
  app.passport.use("login-local", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
  }, async (email, password, done) => {

      log.debug("Invoke local login strategy", email, password);
      
      try {
        const result = await auth.login({ method: "password", email, password });
        console.log("res", result);
        done(null, result.user);
      } catch (err) {
        console.log("error", err);
        done(err);
      }
      
    }
  
  ));

  app.passport.use("login-facebook", new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: `http://${callbackHost}/login/fb/callback`,
    profileFields: ["id", "emails", "name" ],
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {

      log.debug("Invoke Facebook login strategy", accessToken, refreshToken, profile); 
      const result = await loginWithProfile("Facebook", profile);
      done(result.error, result.user);

    }
  
  ));

  app.passport.use("login-google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://${callbackHost}/login/google/callback`,
    profileFields: ["id", "emails", "name" ],
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
      
      log.debug("Invoke Google login strategy", accessToken, refreshToken, profile);
      const result = await loginWithProfile("Google", profile);
      done(result.error, result.user);

    }
                                                       
 ));

}
