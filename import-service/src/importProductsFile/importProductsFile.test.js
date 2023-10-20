import * as s3Presigner from '@aws-sdk/s3-request-presigner';
import * as s3Client from '@aws-sdk/client-s3';
import { importProductsFile } from './index';
import { BUCKET_NAME, ERROR_MESSAGES } from '../constants';

jest.mock('@aws-sdk/s3-request-presigner');
jest.mock('@aws-sdk/client-s3');

describe('importProductsFile', () => {
  test('should fail when the name is not provided', async () => {
    const response = await importProductsFile({ queryStringParameters: {} });
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON.stringify(ERROR_MESSAGES.NO_FILE_NAME));
  });

  test('should fail when the name is empty', async () => {
    const response = await importProductsFile({ queryStringParameters: { name: '' } });
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON.stringify(ERROR_MESSAGES.NO_FILE_NAME));
  });

  test('generate a correct command to s3', async () => {
    const fileName = 'file-name';
    await importProductsFile({ queryStringParameters: { name: fileName } });
    expect(s3Client.GetObjectCommand).toHaveBeenCalledWith({
      Bucket: BUCKET_NAME,
      Key: `uploaded/${fileName}.csv`,
      Expires: 60,
      ContentType: 'text-csv',
    })
  });

  test('should fail if getSignedUrl throws an error', async () => {
    const errorMessage = 'test-error';
    s3Presigner.getSignedUrl.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const response = await importProductsFile({ queryStringParameters: { name: 'file-name' } });
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(JSON.stringify(errorMessage));
  });

  test('should return a correct presigned url', async () => {
    const fileName = 'file-name';
    const result = 'test-url';
    s3Presigner.getSignedUrl.mockImplementation(() => Promise.resolve(result));
    const response = await importProductsFile({ queryStringParameters: { name: fileName } });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify(result));
  });
});
