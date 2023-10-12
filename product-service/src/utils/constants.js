export const DB_NAMES = {
  PRODUCTS: 'products',
  STOCKS: 'stocks',
};

export const ERROR_MESSAGES = {
  PRODUCT_ID_NOT_SPECIFIED: 'Product id not specified',
  PRODUCT_NOT_FOUND: 'Product not found',
  INVALID_PRODUCT_DATA: 'Product data is invalid',
};

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
