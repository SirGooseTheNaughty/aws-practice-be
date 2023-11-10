import { withAuthCheck, withCorsHeaders } from '../common/middleware';
import { HttpSuccess, InternalServerError } from '../common/httpResponses';
import { addProductToCart } from '../cartService';
import { ERROR_MESSAGES } from '../common/constants';

export const addToCart = async (event = {}) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  const { product, count = 1 } = JSON.parse(event.body);
  if (!product?.id) {
    return new InternalServerError(ERROR_MESSAGES.NO_ID);
  }
  if (isNaN(count)) {
    return new InternalServerError(ERROR_MESSAGES.COUNT_IS_NOT_A_NUMBER);
  }

  try {
    const result = await addProductToCart(event.token, product.id, count);
    return new HttpSuccess(result);
  } catch (error) {
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(withAuthCheck(addToCart));
