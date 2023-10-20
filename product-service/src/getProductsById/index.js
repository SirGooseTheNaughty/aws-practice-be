import { getDbProductById } from '../utils/dbFunctions';
import { ERROR_MESSAGES } from '../utils/constants';
import { withCorsHeaders } from '../common/middleware';
import { HttpSuccess, InternalServerError, BadRequestError, NotFoundError } from '../common/httpResponses';

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

    return new HttpSuccess(product);
  } catch (error) {
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(getProductsById);
