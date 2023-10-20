import { getProductsById } from './index';
import * as DbFunctions from '../utils/dbFunctions';
import { ERROR_MESSAGES } from '../utils/constants';

jest.mock('../utils/dbFunctions');

describe('getProductsById', () => {
  test('should return error product id is not provided', async () => {
    const res = await getProductsById({ pathParameters: {} });
    expect(res.statusCode).toBe(400);
    expect(res.body).toBe(JSON.stringify(ERROR_MESSAGES.PRODUCT_ID_NOT_SPECIFIED));
  });

  test('should return error if something goes kaboom', async () => {
    const errorMessage = 'test error';
    DbFunctions.getDbProductById.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const res = await getProductsById({ pathParameters: { id: 1 } });
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(JSON.stringify(errorMessage));
  });

  test('should return product from the db', async () => {
    const product = { id: 1, name: 'product 1', description: 'prod 1 desc' };
    DbFunctions.getDbProductById.mockReturnValue(Promise.resolve(product));
    const res = await getProductsById({ pathParameters: { id: product.id } });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(JSON.stringify(product));
  });
});