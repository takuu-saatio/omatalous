"use strict";

import ServiceInterface from "../ServiceInterface";

export class LocalUserServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "user", Object.assign(options, { provideRoutes: true }));
  }

  //TODO (if necessary)
  //async geUser(uuid) {}
  //...
  
}

export class HttpUserServiceInterface extends ServiceInterface {

  constructor(app, options) {
    super(app, "user", options);
    this.url = options.url;
  }

}
