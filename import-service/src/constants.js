import { S3Client } from '@aws-sdk/client-s3';

export const BUCKET_NAME = 'aws-practice-svorobyev-products-bucket';

export const REGION = 'eu-west-1';

export const s3Client = new S3Client({ region: REGION });

export const ERROR_MESSAGES = {
  NO_FILE_NAME: 'No file name specified',
}

export const DB_NAMES = {
  PRODUCTS: 'products',
  STOCKS: 'stocks',
};