import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, TransactWriteCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb';
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
  const response = await dynamo.send(
    new BatchGetCommand({
      RequestItems: {
        [DB_NAMES.PRODUCTS]: {
          Keys: [
            {
              id: productId,
            }
          ]
        },
        [DB_NAMES.STOCKS]: {
          Keys: [
            {
              product_id: productId,
            }
          ]
        },
      }
    })
  );

  const product = response.Responses?.[DB_NAMES.PRODUCTS]?.[0];
  const stock = response.Responses?.[DB_NAMES.STOCKS]?.[0];

  if (!product) {
    return null;
  }

  return {
    ...product,
    count: stock || 0,
  }
};

export const createDbProduct = async (productData) => {
  const id = crypto.randomUUID();
  const { title, description = '', price, stock = 1 } = productData

  await dynamo.send((
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            Item: { title, description, price, id },
            TableName: DB_NAMES.PRODUCTS,
          },
        },
        {
          Put: {
            Item: { count: stock, product_id: id },
            TableName: DB_NAMES.STOCKS,
          },
        },
      ],
    })
  ))

  return id;
};
