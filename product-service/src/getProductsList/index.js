import { getDbProducts } from '../utils/dbFunctions';
import { withCorsHeaders } from '../common/middleware';
import { HttpSuccess, InternalServerError } from '../common/httpResponses';

export const getProductsList = async (event = {}, context = {}) => {
  console.log(`Event: ${JSON.stringify(event)}. Context: ${JSON.stringify(context)}.`);

  try {
    const products = await getDbProducts();
    return new HttpSuccess(products);
  } catch (error) {
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(getProductsList);
