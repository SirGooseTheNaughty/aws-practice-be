import * as snsClient from "@aws-sdk/client-sns";
import { catalogBatchProcess, sendSns } from './index';
import * as productOperations from './productOperations';

jest.mock("@aws-sdk/client-sns");
jest.mock('./productOperations');

describe('catalogBatchProcess', () => {
  afterEach(() => jest.clearAllMocks());

  test('catalogBatchProcess calls to create a product', async () => {
    const createProductSpy = jest.fn();
    const productData = { id: 1, title: 'product1', description: 'product1descr' };
    productOperations.createProduct.mockImplementation(createProductSpy);

    await catalogBatchProcess({ Records: [{ body: JSON.stringify(productData) }] });

    expect(createProductSpy).toHaveBeenCalledWith(productData);
  });
});
