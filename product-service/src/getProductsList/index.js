import createError from 'http-errors';
import { getDbProducts } from '../utils/dbFunctions';
import { withCorsHeaders } from '../utils/middleware';

export const getProductsList = async (event = {}, context = {}) => {
  console.log(`Event: ${JSON.stringify(event)}. Context: ${JSON.stringify(context)}.`);

  try {
    const products = await getDbProducts();
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error(`Errored: ${JSON.stringify(error)}`);
    return createError(500, error);
  }
};

export default withCorsHeaders(getProductsList);
