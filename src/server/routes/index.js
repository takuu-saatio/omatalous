export default function(app) {
  
  app.get("/login", (req, res, next) => {
    
    try {
          
      req.context.initialState = req.data.initialState = { login: "initialized" }; 
      req.context.reducers = req.data.reducers = [ "login" ];
      
      app.renderPage(req, res);

    } catch (err) {
        next(err);
    }
      
  });

}
