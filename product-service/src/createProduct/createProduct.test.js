import { createProduct } from './index';
import * as DbFunctions from '../utils/dbFunctions';
import { ERROR_MESSAGES } from '../utils/constants';

jest.mock('../utils/dbFunctions');

describe('getProductsById', () => {
  test('should return error product title is not provided', async () => {
    const productData = { description: 'test-description', price: 1 };
    const res = await createProduct({ body: JSON.stringify(productData) });
    expect(res.statusCode).toBe(400);
    expect(res.body).toBe(JSON.stringify(ERROR_MESSAGES.INVALID_PRODUCT_DATA));
  });

  test('should return error product price is not provided', async () => {
    const productData = { title: 'test-title', description: 'test-description' };
    const res = await createProduct({ body: JSON.stringify(productData) });
    expect(res.statusCode).toBe(400);
    expect(res.body).toBe(JSON.stringify(ERROR_MESSAGES.INVALID_PRODUCT_DATA));
  });

  test('should return error if something goes kaboom', async () => {
    const errorMessage = 'test error';
    DbFunctions.createDbProduct.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const productData = { title: 'test-title', description: 'test-description', price: 1 };
    const res = await createProduct({ body: JSON.stringify(productData) });
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(JSON.stringify(errorMessage));
  });

  test('should return a created product id from the db', async () => {
    const testId = 'test-id';
    DbFunctions.createDbProduct.mockReturnValue(testId);
    const productData = { title: 'test-title', description: 'test-description', price: 1 };
    const res = await createProduct({ body: JSON.stringify(productData) });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(testId);
  });
});