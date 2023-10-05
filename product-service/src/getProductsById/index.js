import { getDbProductById } from '../utils/dbFunctions';
import { withCorsHeaders } from '../utils/middleware';

export const getProductsById = async (event) => {
  const { id } = event?.queryStringParameters || {};

  if (!id) {
    return {
      headers: withCorsHeaders(),
      statusCode: 400,
      message: 'Product id not specified',
    };
  }

  try {
    const product = await getDbProductById(id);
    return {
      headers: withCorsHeaders(),
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (e) {
    return {
      headers: withCorsHeaders(),
      statusCode: 404,
      message: e.message,
    };
  }
};

export default getProductsById;
