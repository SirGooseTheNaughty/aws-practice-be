import { withCorsHeaders } from '../common/middleware';
import { HttpSuccess, InternalServerError } from '../common/httpResponses';
import { findOrCreateByUserId } from '../cartService';
import { mergeProductsData } from '../cartService/products';

export const getCart = async (event = {}, context = {}) => {
  console.log(`Event: ${JSON.stringify(event)}. Context: ${JSON.stringify(context)}. Env: ${JSON.stringify(process.env)}`);
  const userId = 'a677f979-6ad3-4979-82b7-bea6474f9bc4';

  try {
    const cart = await findOrCreateByUserId(userId);
    const products = await mergeProductsData(cart?.rows);
    return new HttpSuccess(products);
  } catch (error) {
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(getCart);
