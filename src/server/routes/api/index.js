export function registerRoutes(app) {
  
  app.get("/api/user", (req, res, next) => {

    let user = { username: "vhalme" };
    res.json({ status: "ok", user: user });
      
  });
  
  app.get("/api/login", (req, res, next) => {

    let loginState = { login: "apival" };
    res.json({ status: "ok", login: loginState });
      
  });

}
