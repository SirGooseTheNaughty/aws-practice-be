import { getDbProducts } from '../utils/dbFunctions';
import { withCorsHeaders } from '../utils/middleware';

export const getProductsList = async () => {
  try {
    const products = await getDbProducts();
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (e) {
    return {
      statusCode: 400,
      message: e.message,
    };
  }
};

export default withCorsHeaders(getProductsList);
