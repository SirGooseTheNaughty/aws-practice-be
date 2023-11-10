import { withCorsHeaders } from '../common/middleware';
import { HttpSuccess, InternalServerError, UnauthorizedError } from '../common/httpResponses';
import { addProductToCart } from '../cartService';
import { ERROR_MESSAGES } from '../common/constants';
import { getBasicTokenFromHeaders } from '../common/utils';

export const addToCart = async (event = {}) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  const token = getBasicTokenFromHeaders(event?.headers);
  if (!token) {
    return new UnauthorizedError('No token found');
  }

  const { product, count = 1 } = JSON.parse(event.body);
  if (!product?.id) {
    return new InternalServerError(ERROR_MESSAGES.NO_ID);
  }
  if (isNaN(count)) {
    return new InternalServerError(ERROR_MESSAGES.COUNT_IS_NOT_A_NUMBER);
  }

  try {
    const result = await addProductToCart(token, product.id, count);
    return new HttpSuccess(result?.rowCount);
  } catch (error) {
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(addToCart);
