import getProductsList from './index';
import * as DbFunctions from '../utils/dbFunctions';

jest.mock('../utils/dbFunctions');

describe('getProductsList', () => {
  test('should return products from the db', async () => {
    const products = [
      { id: 1, name: 'product 1', description: 'prod 1 desc' },
      { id: 2, name: 'product 21', description: 'prod 2 desc' },
      { id: 3, name: 'product 3', description: 'prod 3 desc' }
    ]
    DbFunctions.getDbProducts.mockReturnValue(Promise.resolve(products));
    const res = await getProductsList();
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(JSON.stringify(products));
  });

  test('should return error if db read fails', async () => {
    DbFunctions.getDbProducts.mockImplementation(() => {
      throw new Error('test error');
    })
    const res = await getProductsList();
    expect(res.statusCode).toBe(400);
    expect(res.message).toBe('test error');
  });
});