import assets from "./assets.json";

export function registerMiddleware(app) {

  app.use("*", async (req, res, next) => {
  
    console.log("use middleware");
  
    let statusCode = 200;
    console.log("create data"); 
    const data = { 
      title: "",
      description: "",
      css: "",
      body: "",
      entry: assets.app.js 
    };
    
    console.log("create context"); 
    const context = {
      initialState: {},
      reducers: [],
      css: [],
      statusCode: 200,
      insertCss: styles => context.css.push(styles._getCss()),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => context.statusCode = 404
    };

    req.context = context;
    req.data = data;
        
    console.log("middleware >>> next");
    next();

  });

}
