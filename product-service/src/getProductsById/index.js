import { getDbProductById } from '../utils/dbFunctions';
import { withCorsHeaders } from '../utils/middleware';
import { ERROR_MESSAGES, BadRequestError, InternalServerError, NotFoundError } from '../utils/constants';

export const getProductsById = async (event = {}, context = {}) => {
  console.log(`Event: ${JSON.stringify(event)}. Context: ${JSON.stringify(context)}.`);

  const { id } = event?.pathParameters || {};

  console.log(`Product id: ${id}`);

  if (!id) {
    return new BadRequestError(ERROR_MESSAGES.PRODUCT_ID_NOT_SPECIFIED);
  }

  try {
    const product = await getDbProductById(id);

    if (!product) {
      return new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
    }

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(getProductsById);
