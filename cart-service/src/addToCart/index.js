import { withCorsHeaders } from '../common/middleware';
import { HttpSuccess, InternalServerError } from '../common/httpResponses';
import { addProductToCart } from '../cartService';

export const addToCart = async (event = {}, context = {}) => {
  console.log(`Event: ${JSON.stringify(event)}`);
  const { productId } = JSON.parse(event.body);
  const userId = 'a677f979-6ad3-4979-82b7-bea6474f9bc4';

  try {
    const result = await addProductToCart(userId, productId);
    return new HttpSuccess(result?.rowCount);
  } catch (error) {
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(addToCart);
