import getProductsById from './index';
import * as DbFunctions from '../utils/dbFunctions';

jest.mock('../utils/dbFunctions');

describe('getProductsById', () => {
  test('should return error product id is not provided', async () => {
    const res = await getProductsById({ queryStringParameters: {} });
    expect(res.statusCode).toBe(400);
    expect(res.message).toBe('Product id not specified');
  });

  test('should return error if db read fails', async () => {
    DbFunctions.getDbProductById.mockImplementation(() => {
      throw new Error('test error');
    })
    const res = await getProductsById({ queryStringParameters: { id: 1 } });
    expect(res.statusCode).toBe(400);
    expect(res.message).toBe('test error');
  });

  test('should return product from the db', async () => {
    const product = { id: 1, name: 'product 1', description: 'prod 1 desc' };
    DbFunctions.getDbProductById.mockReturnValue(Promise.resolve(product));
    const res = await getProductsById({ queryStringParameters: { id: product.id } });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(JSON.stringify(product));
  });
});