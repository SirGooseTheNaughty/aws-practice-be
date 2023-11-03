import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';
import { DB_NAMES } from '../constants';

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const createProduct = async (productData) => {
  const newId = crypto.randomUUID();
  const { title, description = '', price, stock = 1, id } = productData;
  console.log(`title: ${title}, id: ${id}, id type: ${typeof id}, stock: ${stock}, typeof stock: ${typeof stock}`);

  await dynamo.send((
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            Item: { title, description, price, id: id || newId },
            TableName: DB_NAMES.PRODUCTS,
          },
        },
        {
          Put: {
            Item: { count: stock, product_id: id || newId },
            TableName: DB_NAMES.STOCKS,
          },
        },
      ],
    })
  ))

  return id;
};