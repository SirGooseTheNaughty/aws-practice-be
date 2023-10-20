export class HttpSuccess {
  constructor(body) {
    this.statusCode = 200;
    this.body = body ? JSON.stringify(body) : null;
  }
}

export class HttpError {
  constructor(status, message) {
    this.statusCode = status;
    this.body = JSON.stringify(message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message) {
    super(404, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message) {
    super(400, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message) {
    super(500, message);
  }
}