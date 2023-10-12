import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';
import { DB_NAMES } from './constants';

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const getDbProducts = async () => {
  const [productItems, stocksItems] = await Promise.all([
    dynamo.send(
      new ScanCommand({ TableName: DB_NAMES.PRODUCTS })
    ),
    dynamo.send(
      new ScanCommand({ TableName: DB_NAMES.STOCKS })
    ),
  ])
    .then(([products, stocks]) => [products.Items, stocks.Items]);

  return productItems.map((productItem) => {
    const stockValue = stocksItems.find(({ product_id }) => product_id === productItem.id)?.count || 0;
    return {
      ...productItem,
      count: stockValue,
    }
  });
};

export const getDbProductById = async (productId) => {
  const [productItem, stockItem] = await Promise.all([
    dynamo.send(
      new GetCommand({
        TableName: DB_NAMES.PRODUCTS,
        Key: {
          id: productId,
        }
      })
    ),
    dynamo.send(
      new GetCommand({
        TableName: DB_NAMES.STOCKS,
        Key: {
          product_id: productId,
        }
      })
    ),
  ])
    .then(([product, stock]) => [product.Item, stock.Item]);

  if (!productItem) {
    return null;
  }

  return {
    ...productItem,
    count: stockItem.count || 0,
  }
};

export const createDbProduct = async (productData) => {
  const id = crypto.randomUUID();

  await dynamo.send(
    new PutCommand({
      TableName: DB_NAMES.PRODUCTS,
      Item: {
        ...productData,
        id,
      },
    })
  );

  return id;
};
