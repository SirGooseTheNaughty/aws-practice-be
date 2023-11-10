import { withAuthCheck, withCorsHeaders } from '../common/middleware';
import { HttpSuccess, InternalServerError } from '../common/httpResponses';
import { getUserCart } from '../cartService';
import { mergeProductsData } from '../cartService/products';

export const getCart = async (event = {}, context = {}) => {
  console.log(`Event: ${JSON.stringify(event)}. Context: ${JSON.stringify(context)}. Env: ${JSON.stringify(process.env)}`);

  try {
    const cart = await getUserCart(event.token);
    const products = await mergeProductsData(cart);
    return new HttpSuccess(products);
  } catch (error) {
    console.error('Getting a cart errored: ', error);
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(withAuthCheck(getCart));
