import log4js from "log4js";
const log = log4js.getLogger("server/routes/api");

export function registerRoutes(app) {

  let { User } = app.entities;

  app.get("/api/user/:uuid", (req, res, next) => {
    
    User.schema.findByUuid(req.params.uuid)
    .then((user) => {

      if (!user) {
        return next({ err: "notfound" });
      }

      res.json({ status: "ok", user: user.json() });
    
    })
    .catch((err) => {
      next({ err: err });
    });

  
  });
  
  app.post("/api/user", (req, res, next) => {
    
    let user = req.body;
    User.schema.create(user).then((createdUser) => {
      res.json({ status: "ok", user: createdUser.json() });
    })
    .catch((err) => {
      log.debug("err", err);
    });
  
  });

  app.get("/api/login", (req, res, next) => {

    let loginState = { login: "apival" };
    res.json({ status: "ok", login: loginState });
      
  });

}
