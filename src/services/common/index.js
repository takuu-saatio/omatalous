"use strict";

import ServiceInterface from "../ServiceInterface";

export class LocalCommonServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "common", Object.assign(options, { provideRoutes: true }));
  }

  //TODO (if necessary)
  //async geContent(path) {}
  //...
  
}

export class HttpCommonServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "common", options);
    this.url = options.url;
  }

}
