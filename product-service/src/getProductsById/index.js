import { getDbProductById } from '../utils/dbFunctions';
import { withCorsHeaders } from '../utils/middleware';

export const getProductsById = async (event) => {
  const { id } = event?.pathParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      message: 'Product id not specified',
    };
  }

  try {
    const product = await getDbProductById(id);
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (e) {
    return {
      statusCode: 404,
      message: e.message,
    };
  }
};

export default withCorsHeaders(getProductsById);
