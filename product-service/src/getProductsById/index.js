import createError from 'http-errors';
import { getDbProductById } from '../utils/dbFunctions';
import { withCorsHeaders } from '../utils/middleware';
import { ERROR_MESSAGES } from '../utils/constants';

export const getProductsById = async (event = {}, context = {}) => {
  console.log(`Event: ${JSON.stringify(event)}. Context: ${JSON.stringify(context)}.`);

  const { id } = event?.pathParameters || {};

  console.log(`Product id: ${id}`);

  if (!id) {
    return createError(400, { message: ERROR_MESSAGES.PRODUCT_ID_NOT_SPECIFIED })
  }

  try {
    const product = await getDbProductById(id);

    if (!product) {
      return createError(404, { message: ERROR_MESSAGES.PRODUCT_NOT_FOUND })
    }

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    console.error(`Errored: ${JSON.stringify(error)}`);
    return createError(500, error);
  }
};

export default withCorsHeaders(getProductsById);
