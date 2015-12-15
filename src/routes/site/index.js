"use strict";

import log4js from "log4js";
const log = log4js.getLogger("server/routes");

import { readContent } from "../../core/utils";

export function registerRoutes(app) {
  
  app.get("/login", (req, res, next) => {
    
    req.context.initialState = { 
      login: { iso: true, status: "iso" }
    };

    app.renderPage(req, res);
    
  });
   
  app.get(/^(\/(?!_))(?!api\/?)/i, async (req, res, next) => {
        
    try {
    
      const content = await readContent(req.path);
       
      if (content.error) {
        return next(content.error);
      }
      
      req.context.initialState = {
        content: Object.assign(content.data, { iso: true })
      };

      app.renderPage(req, res);

    } catch(err) {
      console.log(err);
      next({ error: err });
    } 

  });
    

}
