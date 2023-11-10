import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchGetCommand } from '@aws-sdk/lib-dynamodb';
import { DB_NAMES, EMPTY_PRODUCT } from '../common/constants';

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const getDbProductsByIds = async (productIds) => {
  const response = await dynamo.send(
    new BatchGetCommand({
      RequestItems: {
        [DB_NAMES.PRODUCTS]: {
          Keys: productIds.map(id => ({ id })),
        },
      }
    })
  );

  return response.Responses?.[DB_NAMES.PRODUCTS] || [];
};

export const mergeProductsData = async (cartProducts) => {
  if (!cartProducts?.length) {
    return [];
  }
  const productIds = cartProducts.map(({ product_id }) => product_id).filter((product) => !!product);
  if (!productIds?.length) {
    return [];
  }
  const dbProducts = await getDbProductsByIds(productIds);
  return cartProducts.map(({ product_id, count }) => {
    const dbProduct = dbProducts.find(({ id }) => id === product_id);
    return {
      ...(dbProduct || EMPTY_PRODUCT),
      count,
    }
  });
};
