"use strict";

export class BaseError extends Error {

  constructor(data, id, statusCode) {
    const message = (data && data.message) ? data.message : undefined;
    id = id || ((data && data.id) ? data.id : (statusCode || 500));
    super(message ? message : id);
    this.message = message;
    this.id = id;
    this.data = data ? data : undefined;
    this.statusCode = statusCode || 500;
  }

}

export class Unauthorized extends BaseError {
  constructor(data, id) {
    id = id || "unauthorized";
    super(data, id, 401);
  }
}

export class Forbidden extends BaseError {
  constructor(data, id) {
    id = id || "forbidden";
    super(data, id, 403);
  }
}

export class NotFound extends BaseError {
  constructor(data, id) {
    id = id || "not_found";
    super(data, id, 404);
  }
}

export class UnprocessableEntity extends BaseError {
  constructor(data, id) {
    id = id || "unprocessable_entity";
    super(data, id, 422);
  }
}
