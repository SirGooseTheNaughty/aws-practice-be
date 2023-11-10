import { withCorsHeaders } from '../common/middleware';
import { HttpSuccess, InternalServerError, UnauthorizedError } from '../common/httpResponses';
import { getUserCart } from '../cartService';
import { mergeProductsData } from '../cartService/products';
import { getBasicTokenFromHeaders } from '../common/utils';

export const getCart = async (event = {}, context = {}) => {
  console.log(`Event: ${JSON.stringify(event)}. Context: ${JSON.stringify(context)}. Env: ${JSON.stringify(process.env)}`);

  const token = getBasicTokenFromHeaders(event?.headers);
  if (!token) {
    return new UnauthorizedError('No token found');
  }

  try {
    const cart = await getUserCart(token);
    const products = await mergeProductsData(cart);
    return new HttpSuccess(products);
  } catch (error) {
    console.error('Getting a cart errored: ', error);
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(getCart);
