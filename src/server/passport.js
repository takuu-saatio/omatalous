"use strict";

export default function(app) {

  const LocalStrategy = require("passport-local").Strategy;
  
  const { auth } = app.services;

  app.passport.use("login-pwd", new LocalStrategy(
    
    (email, password, done) => {

      console.log("invoke local strat", email, password);

      auth.login({
        method: "passport",
        email: email,
        password: password
      })
      .then((result) => {
        done(null, result.user);
      })
      .catch((err) => {
        switch (err.id) {
          case "user_not_found":
            return done(null, false, { message: "Incorrect username" });
          case "pwd_mismatch":
            return done(null, false, { message: "Incorrect password" });
          default:
            return done(err);
        }
      });

    }
  
  ));

}
