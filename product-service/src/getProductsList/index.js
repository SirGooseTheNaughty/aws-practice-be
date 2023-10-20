import { getDbProducts } from '../utils/dbFunctions';
import { withCorsHeaders } from '../utils/middleware';
import { InternalServerError } from '../utils/constants';

export const getProductsList = async (event = {}, context = {}) => {
  console.log(`Event: ${JSON.stringify(event)}. Context: ${JSON.stringify(context)}.`);

  try {
    const products = await getDbProducts();
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(getProductsList);
