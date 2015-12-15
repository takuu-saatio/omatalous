import assets from "./assets.json";
import { readLocalizedMessages } from "../core/utils";

export function registerMiddleware(app) {
  
  app.use(async (req, res, next) => {
  
    console.log("use middleware", req.locale);
     
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
    const messages = await readLocalizedMessages(req.locale);
    console.log("read messages", messages);
    const context = {
      intlData: { 
        locales: ["en-US"],
        messages: messages
      },
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

export function registerErrorHandlers(app) {
  app.use("/api", (err, req, res, next) => {
    console.log("ERROR!!!");
    res.json({ error: err });
  });
}
