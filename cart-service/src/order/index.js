import { withAuthCheck, withCorsHeaders } from '../common/middleware';
import { HttpSuccess, InternalServerError } from '../common/httpResponses';
import { placeOrder } from '../cartService';

export const order = async (event = {}) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  try {
    const orderId = await placeOrder(event.token);
    return new HttpSuccess(orderId);
  } catch (error) {
    console.error('Placing an order errored: ', error);
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(withAuthCheck(order));
